const cfg = window.TREK_SUPABASE || {};
const hasConfig = Boolean(cfg.url && cfg.anonKey);
const supabase = hasConfig ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value, currency = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(value || 0));

let session = null;
let profile = null;
let isAdmin = false;

function showNotice(message, tone = '') {
    const notice = $('#notice');
    notice.textContent = message;
    notice.className = `notice ${tone}`;
    notice.classList.remove('hidden');
}

function lines(value) {
    return String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);
}

function setView(view) {
    $$('.view').forEach((item) => item.classList.toggle('active', item.id === `${view}View`));
    $$('.tab').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
}

async function loadSession() {
    if (!hasConfig) {
        showNotice('Add your Supabase URL and anon key in /suppliers/supabase-config.js to activate registration, dashboard, bookings, and payouts.');
        return;
    }

    const { data } = await supabase.auth.getSession();
    session = data.session;
    $('#signedOut').classList.toggle('hidden', Boolean(session));
    $('#signedIn').classList.toggle('hidden', !session);
    $('#authEmail').textContent = session?.user?.email || '';

    if (session) {
        isAdmin = ['admin', 'super_admin'].includes(session.user.app_metadata?.role) || ['admin', 'super_admin'].includes(session.user.user_metadata?.role);
        $('#adminPanel').classList.toggle('hidden', !isAdmin);
        if (isAdmin) await loadAdmin();
        await loadProfile();
    }
}

async function loadProfile() {
    const { data, error } = await supabase
        .from('supplier_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

    if (error) {
        showNotice(error.message);
        return;
    }

    profile = data;
    $('#dashboard').classList.toggle('hidden', !profile);
    $('#registerPanel').classList.toggle('hidden', Boolean(profile));

    if (!profile) return;

    $('#supplierName').textContent = profile.business_name;
    $('#profileStatus').textContent = profile.status.replaceAll('_', ' ');
    $('#profileStatus').className = `status ${profile.status}`;
    await Promise.all([loadProducts(), loadBookings(), loadPayouts(), loadReviews(), loadNotifications()]);
}

async function signUp(event) {
    event.preventDefault();
    if (!supabase) return showNotice('Supabase is not configured yet.');
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const password = form.get('password');

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: 'supplier' } },
    });

    if (error) return showNotice(error.message);
    showNotice('Check your email to verify your account, then sign in and complete supplier onboarding.');
}

async function signIn(event) {
    event.preventDefault();
    if (!supabase) return showNotice('Supabase is not configured yet.');
    const form = new FormData(event.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
        email: form.get('email'),
        password: form.get('password'),
    });
    if (error) return showNotice(error.message);
    await loadSession();
}

async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
}

async function uploadFile(file, bucket, prefix) {
    if (!file || !file.name) return null;
    const cleanName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    const path = `${prefix}/${crypto.randomUUID()}-${cleanName}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (error) throw error;

    if (bucket === 'supplier-media') {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    }

    return path;
}

async function saveProfile(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    let liabilityPath = profile?.liability_insurance_path || null;
    let logoPath = profile?.logo_path || null;
    let photoPath = profile?.profile_photo_path || null;

    try {
        liabilityPath = await uploadFile(form.get('liability_insurance'), 'supplier-documents', `${session.user.id}/insurance`) || liabilityPath;
        logoPath = await uploadFile(form.get('logo'), 'supplier-media', `${session.user.id}/logos`) || logoPath;
        photoPath = await uploadFile(form.get('profile_photo'), 'supplier-media', `${session.user.id}/profiles`) || photoPath;
    } catch (error) {
        return showNotice(error.message);
    }

    const payload = {
        user_id: session.user.id,
        business_name: form.get('business_name'),
        provider_kind: form.get('provider_kind'),
        provider_type: form.get('provider_type'),
        contact_name: form.get('contact_name'),
        contact_email: session.user.email,
        phone: form.get('phone'),
        website_url: form.get('website_url'),
        locations: lines(form.get('locations')).map((name) => ({ name })),
        registration_tax_number: form.get('registration_tax_number'),
        payout_method: form.get('payout_method'),
        bank_details: {
            account_name: form.get('bank_account_name'),
            bank_name: form.get('bank_name'),
            account_number: form.get('bank_account_number'),
            swift_code: form.get('bank_swift_code'),
        },
        mobile_money_details: {
            provider: form.get('mobile_money_provider'),
            number: form.get('mobile_money_number'),
        },
        liability_insurance_path: liabilityPath,
        logo_path: logoPath,
        profile_photo_path: photoPath,
        status: 'pending_admin_review',
    };

    const { error } = await supabase.from('supplier_profiles').upsert(payload, { onConflict: 'user_id' });
    if (error) return showNotice(error.message);
    showNotice('Supplier profile submitted. Trek Africa Guide will review it before dashboard publishing is enabled.');
    await loadProfile();
}

async function saveProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title');
    let uploadedPhotos = [];
    try {
        uploadedPhotos = await Promise.all([...form.getAll('photo_files')].filter((file) => file.name).map((file) => uploadFile(file, 'supplier-media', `${session.user.id}/products`)));
    } catch (error) {
        return showNotice(error.message);
    }

    const payload = {
        supplier_id: profile.id,
        title,
        slug: String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        service_type: form.get('service_type'),
        category: form.get('category'),
        status: form.get('status'),
        booking_mode: form.get('booking_mode'),
        affiliate_url: form.get('affiliate_url') || null,
        description: form.get('description'),
        highlights: lines(form.get('highlights')),
        itinerary: lines(form.get('itinerary')),
        included: lines(form.get('included')),
        excluded: lines(form.get('excluded')),
        duration: form.get('duration'),
        min_group_size: Number(form.get('min_group_size') || 1),
        max_group_size: Number(form.get('max_group_size') || 0) || null,
        languages: lines(form.get('languages')),
        meeting_point: form.get('meeting_point'),
        base_price: Number(form.get('base_price') || 0),
        currency: form.get('currency') || 'USD',
        pricing_tiers: lines(form.get('pricing_tiers')).map((item) => ({ label: item })),
        availability: { notes: form.get('availability') },
        photos: [...lines(form.get('photos')), ...uploadedPhotos],
        videos: lines(form.get('videos')),
    };

    const { error } = await supabase.from('supplier_products').insert(payload);
    if (error) return showNotice(error.message);
    event.currentTarget.reset();
    showNotice('Product saved. Published products can be direct-booked or used as affiliate listings.');
    await loadProducts();
}

async function loadProducts() {
    const { data, error } = await supabase.from('supplier_products').select('*').eq('supplier_id', profile.id).order('created_at', { ascending: false });
    if (error) return showNotice(error.message);
    $('#productsBody').innerHTML = data.map((item) => `
        <tr>
            <td><strong>${item.title}</strong><div class="muted">${item.category} / ${item.service_type}</div></td>
            <td><span class="status ${item.status}">${item.status}</span></td>
            <td>${item.booking_mode}</td>
            <td>${money(item.base_price, item.currency)}</td>
        </tr>
    `).join('') || '<tr><td colspan="4">No products yet.</td></tr>';
}

async function loadBookings() {
    const { data, error } = await supabase
        .from('supplier_bookings')
        .select('*, supplier_products(title)')
        .eq('supplier_id', profile.id)
        .order('created_at', { ascending: false });
    if (error) return showNotice(error.message);

    const gross = data.reduce((sum, row) => sum + Number(row.total_amount), 0);
    const commission = data.reduce((sum, row) => sum + Number(row.commission_amount), 0);
    const net = data.reduce((sum, row) => sum + Number(row.supplier_payout_amount), 0);
    $('#statBookings').textContent = data.length;
    $('#statGross').textContent = money(gross);
    $('#statCommission').textContent = money(commission);
    $('#statNet').textContent = money(net);

    $('#bookingsBody').innerHTML = data.map((item) => `
        <tr>
            <td><strong>${item.supplier_products?.title || 'Booking'}</strong><div class="muted">${item.customer_name} / ${item.customer_email}</div></td>
            <td><span class="status ${item.status}">${item.status}</span></td>
            <td>${money(item.total_amount, item.currency)}</td>
            <td>${item.commission_rate}% / ${money(item.commission_amount, item.currency)}</td>
            <td>${money(item.supplier_payout_amount, item.currency)}</td>
        </tr>
    `).join('') || '<tr><td colspan="5">Bookings will appear here after checkout or API sync.</td></tr>';
}

async function loadPayouts() {
    const { data, error } = await supabase.from('supplier_payouts').select('*').eq('supplier_id', profile.id).order('period_end', { ascending: false });
    if (error) return showNotice(error.message);
    $('#payoutsBody').innerHTML = data.map((item) => `
        <tr>
            <td>${item.period_start} to ${item.period_end}</td>
            <td>${money(item.gross_amount, item.currency)}</td>
            <td>${money(item.commission_amount, item.currency)}</td>
            <td>${money(item.net_amount, item.currency)}</td>
            <td><span class="status ${item.status}">${item.status}</span></td>
        </tr>
    `).join('') || '<tr><td colspan="5">Monthly payout history will appear here.</td></tr>';
}

async function loadReviews() {
    const { data } = await supabase.from('supplier_reviews').select('*, supplier_products(title)').eq('supplier_id', profile.id).order('created_at', { ascending: false });
    $('#reviewsList').innerHTML = (data || []).map((item) => `<div class="card"><strong>${'★'.repeat(item.rating)} ${item.customer_name}</strong><p>${item.comment || ''}</p><span class="muted">${item.supplier_products?.title || 'Supplier review'}</span></div>`).join('') || '<div class="card">Reviews and ratings will appear here after customers travel.</div>';
}

async function loadNotifications() {
    const { data } = await supabase.from('supplier_notifications').select('*').eq('supplier_id', profile.id).order('created_at', { ascending: false }).limit(10);
    $('#notificationsList').innerHTML = (data || []).map((item) => `<div class="card"><strong>${item.title}</strong><p>${item.body || ''}</p><span class="muted">${new Date(item.created_at).toLocaleString()}</span></div>`).join('') || '<div class="card">No notifications yet.</div>';
}

async function loadAdmin() {
    const [{ data: suppliers }, { data: settings }] = await Promise.all([
        supabase.from('supplier_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('supplier_commission_settings').select('*').eq('setting_key', 'default').maybeSingle(),
    ]);

    $('#defaultCommission').value = settings?.rate || 18;
    $('#adminSuppliersBody').innerHTML = (suppliers || []).map((item) => `
        <tr>
            <td><strong>${item.business_name}</strong><div class="muted">${item.contact_email}<br>${(item.locations || []).map((loc) => loc.name || loc).join(', ')}</div></td>
            <td><span class="status ${item.status}">${item.status.replaceAll('_', ' ')}</span></td>
            <td><input data-commission="${item.id}" type="number" min="0" max="50" step="0.01" value="${item.commission_rate || ''}" placeholder="Default"></td>
            <td class="nav-actions">
                <button type="button" data-admin-action="approve" data-id="${item.id}">Approve</button>
                <button class="secondary" type="button" data-admin-action="reject" data-id="${item.id}">Reject</button>
                <button class="secondary" type="button" data-admin-action="commission" data-id="${item.id}">Save rate</button>
                <button class="clay" type="button" data-admin-action="payout" data-id="${item.id}">Create payout</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4">No suppliers yet.</td></tr>';

    $$('[data-admin-action]').forEach((button) => button.addEventListener('click', adminAction));
}

async function adminAction(event) {
    const button = event.currentTarget;
    const id = button.dataset.id;
    const action = button.dataset.adminAction;

    if (action === 'approve' || action === 'reject') {
        const payload = action === 'approve'
            ? { status: 'approved', approved_at: new Date().toISOString(), rejected_at: null }
            : { status: 'rejected', rejected_at: new Date().toISOString() };
        const { error } = await supabase.from('supplier_profiles').update(payload).eq('id', id);
        if (error) return showNotice(error.message);
    }

    if (action === 'commission') {
        const rate = $(`[data-commission="${id}"]`).value || null;
        const { error } = await supabase.from('supplier_profiles').update({ commission_rate: rate }).eq('id', id);
        if (error) return showNotice(error.message);
    }

    if (action === 'payout') {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
        const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
        const { error } = await supabase.rpc('create_supplier_monthly_payout', { p_supplier_id: id, p_period_start: start, p_period_end: end });
        if (error) return showNotice(error.message);
    }

    showNotice('Admin update saved.');
    await loadAdmin();
}

async function saveDefaultCommission(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await supabase
        .from('supplier_commission_settings')
        .upsert({ setting_key: 'default', rate: Number(form.get('rate')), description: 'Default Trek Africa Guide supplier commission rate.' }, { onConflict: 'setting_key' });
    if (error) return showNotice(error.message);
    showNotice('Default commission rate updated.');
}

$$('.tab').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
$('#signupForm').addEventListener('submit', signUp);
$('#signinForm').addEventListener('submit', signIn);
$('#logoutBtn').addEventListener('click', signOut);
$('#profileForm').addEventListener('submit', saveProfile);
$('#productForm').addEventListener('submit', saveProduct);
$('#defaultCommissionForm').addEventListener('submit', saveDefaultCommission);
loadSession();
