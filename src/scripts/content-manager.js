// Content Manager — client-side admin app.
// Auth token is stored in localStorage and sent as a Bearer header.
// All server-side authorization happens in Netlify Functions via requireAdmin().

const API_BASE = '/.netlify/functions';
const TOKEN_KEY = 'cm_token';
const USER_KEY = 'cm_user_email';

// --- API helper ---

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function api(path, { method = 'GET', body = null } = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${path}`, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `HTTP ${response.status}`);
    error.code = data?.error || 'UNKNOWN';
    error.status = response.status;
    throw error;
  }

  return data;
}

// --- Auth bootstrap ---

async function checkAuth() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = '/admin/auth';
    return null;
  }

  try {
    // Verify token is still valid by making a test API call
    await api('/cm-drafts?limit=1');
    return token;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/admin/auth';
    }
    return null;
  }
}

// --- Tab navigation ---

function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const panels = document.querySelectorAll('.admin-tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.id === `tab-${tab.dataset.tab}`));

      // Load data for the activated tab
      const loader = tabLoaders[tab.dataset.tab];
      if (loader) loader();
    });
  });
}

// --- Render helpers ---

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function statusBadge(status, type = 'status') {
  const labels = {
    queued: 'Queued', researching: 'Researching', extracted: 'Extracted',
    matched: 'Matched', errored: 'Errored', completed: 'Completed',
    draft: 'Draft', needs_verification: 'Needs Verification',
    ready_for_review: 'Ready for Review', approved: 'Approved',
    rejected: 'Rejected', published: 'Published',
    pending: 'Pending',
  };
  const colors = {
    queued: 'info', researching: 'info', extracted: 'info',
    matched: 'warning', errored: 'error', completed: 'success',
    draft: 'info', needs_verification: 'warning',
    ready_for_review: 'info', approved: 'success',
    rejected: 'error', published: 'success',
    pending: 'warning',
  };
  const label = labels[status] || status;
  const color = colors[status] || 'info';
  return `<span class="admin-badge admin-badge-${color}">${escapeHtml(label)}</span>`;
}

// --- Tab loaders ---

const tabLoaders = {
  research: loadResearchQueue,
  suggestions: loadSuggestions,
  drafts: loadDrafts,
  verification: loadVerificationQueue,
  approval: loadApprovalQueue,
  published: loadPublished,
  sources: loadSources,
  activity: loadActivityLog,
};

// --- Research Queue ---

async function loadResearchQueue() {
  const tbody = document.getElementById('cm-research-tbody');
  if (!tbody) return;

  try {
    const { queue } = await api('/cm-research?limit=100');
    if (!queue.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="admin-text-muted">No research tasks in queue.</td></tr>';
      return;
    }

    tbody.innerHTML = queue.map((item) => `
      <tr data-queue-id="${item.id}">
        <td>
          ${item.source_url
            ? `<a href="${escapeHtml(item.source_url)}" target="_blank" class="admin-link">${escapeHtml(new URL(item.source_url).hostname)}</a>`
            : `<em class="admin-text-muted">${escapeHtml(item.search_query || '—')}</em>`
          }
        </td>
        <td>${escapeHtml(item.target_entity)}</td>
        <td>${statusBadge(item.status)}</td>
        <td>${item.ai_job_id ? `<small class="admin-text-muted">${item.ai_job_id.slice(0, 8)}…</small>` : '—'}</td>
        <td><small class="admin-text-muted">${formatDate(item.created_at)}</small></td>
        <td>
          ${item.ai_job_id
            ? `<a href="#" class="admin-link admin-link-small" data-action="view-draft" data-queue-id="${item.id}">View Draft →</a>`
            : '<em class="admin-text-muted">Pending</em>'
          }
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</td></tr>`;
  }
}

async function submitResearchForm() {
  const form = document.getElementById('cm-research-form');
  const resultEl = document.getElementById('cm-research-result');
  if (!form || !resultEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultEl.style.display = 'none';

    const formData = new FormData(form);
    const payload = {
      source_url: formData.get('source_url'),
      target_entity: formData.get('target_entity'),
    };

    try {
      resultEl.className = 'admin-alert admin-alert-info';
      resultEl.textContent = 'Starting research…';
      resultEl.style.display = 'block';

      const result = await api('/cm-research', { method: 'POST', body: payload });

      if (result.error) {
        resultEl.className = 'admin-alert admin-alert-error';
        resultEl.textContent = `Error: ${result.error}`;
      } else {
        resultEl.className = 'admin-alert admin-alert-success';
        let msg = `Draft created! (${result.draft_id?.slice(0, 8)}…)`;
        if (result.duplicates?.length) {
          msg += ` — ${result.duplicates.length} potential duplicate(s) found.`;
        }
        if (result.cached) msg += ' (cached result)';
        resultEl.textContent = msg;
        form.reset();
      }

      // Refresh the queue
      setTimeout(() => loadResearchQueue(), 1000);
    } catch (error) {
      resultEl.className = 'admin-alert admin-alert-error';
      resultEl.textContent = `Error: ${escapeHtml(error.message)}`;
    }
  });
}

// --- Suggestions (Duplicates) ---

async function loadSuggestions() {
  const container = document.getElementById('cm-suggestions-list');
  if (!container) return;

  container.innerHTML = '<p class="admin-text-muted">Loading suggestions…</p>';

  try {
    // Load drafts that have duplicates (matched status) and are in needs_verification
    const { drafts } = await api('/cm-drafts?workflow_status=needs_verification');
    // Filter to drafts that had duplicates detected — we check the research queue
    const { queue } = await api('/cm-research?status=matched');

    if (!queue.length && !drafts.length) {
      container.innerHTML = '<p class="admin-text-muted">No suggestions with duplicates found.</p>';
      return;
    }

    container.innerHTML = queue.map((item) => `
      <div class="admin-card admin-card-compact">
        <div class="admin-card-header">
          <span class="admin-badge admin-badge-warning">Matched</span>
          <span class="admin-badge admin-badge-secondary">${escapeHtml(item.target_entity)}</span>
        </div>
        <div class="admin-card-body">
          <h4>${escapeHtml(item.source_url ? new URL(item.source_url).hostname : '—')}</h4>
          <p class="admin-text-muted">AI job: ${item.ai_job_id ? item.ai_job_id.slice(0, 12) + '…' : '—'}</p>
          <p class="admin-text-muted">Researched: ${formatDate(item.created_at)}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</div>`;
  }
}

// --- Drafts ---

async function loadDrafts() {
  const tbody = document.getElementById('cm-drafts-tbody');
  if (!tbody) return;

  try {
    const statusFilter = document.getElementById('cm-drafts-status-filter')?.value;
    const entityFilter = document.getElementById('cm-drafts-entity-filter')?.value;

    const params = new URLSearchParams();
    if (statusFilter) params.set('workflow_status', statusFilter);
    if (entityFilter) params.set('target_entity', entityFilter);
    params.set('limit', '100');

    const { drafts } = await api(`/cm-drafts?${params}`);

    if (!drafts.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="admin-text-muted">No drafts found.</td></tr>';
      return;
    }

    tbody.innerHTML = drafts.map((draft) => {
      const typeName = {
        region: 'Region', country: 'Country', attraction: 'Attraction',
        accommodation: 'Accommodation', restaurant: 'Restaurant',
        tour_operator: 'Tour Operator', activity: 'Activity',
        travel_article: 'Travel Article',
      }[draft.target_entity] || draft.target_entity;

      const approvalLabel = {
        pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
      }[draft.approval_status] || draft.approval_status;

      const approvalColor = {
        pending: 'warning', approved: 'success', rejected: 'error',
      }[draft.approval_status] || 'info';

      return `
        <tr data-draft-id="${draft.id}">
          <td>${escapeHtml(typeName)}</td>
          <td><span class="admin-badge admin-badge-secondary">${escapeHtml(draft.draft_type)}</span></td>
          <td>${statusBadge(draft.workflow_status)}</td>
          <td><span class="admin-badge admin-badge-${approvalColor}">${escapeHtml(approvalLabel)}</span></td>
          <td>
            ${draft.source_url
              ? `<a href="${escapeHtml(draft.source_url)}" target="_blank" class="admin-link admin-link-small">${escapeHtml(draft.source_name || new URL(draft.source_url).hostname)}</a>`
              : '—'
            }
          </td>
          <td><small class="admin-text-muted">${formatDate(draft.created_at)}</small></td>
          <td>
            <button class="admin-btn admin-btn-small" data-action="view-draft" data-draft-id="${draft.id}">View</button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach event listener for view-draft buttons
    tbody.querySelectorAll('[data-action="view-draft"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const draftId = btn.dataset.draftId;
        openDraftModal(draftId);
      });
    });
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</td></tr>`;
  }
}

// --- Draft modal ---

let currentDraft = null;

async function openDraftModal(draftId) {
  try {
    const { draft } = await api(`/cm-drafts?id=${draftId}`);
    currentDraft = draft;

    // Build draft data JSON display
    const dataJson = JSON.stringify(draft.draft_data, null, 2);

    // Build changes table for update drafts
    let changesHtml = '';
    if (draft.draft_type === 'update' && draft.changes?.length) {
      changesHtml = `
        <table class="admin-table admin-table-sm">
          <thead><tr><th>Field</th><th>Current</th><th>Proposed</th><th>Decision</th></tr></thead>
          <tbody>
            ${draft.changes.map((c) => `
              <tr data-field="${c.field_name}">
                <td><code>${c.field_name}</code></td>
                <td><pre class="admin-code-block">${escapeJson(c.old_value)}</pre></td>
                <td><pre class="admin-code-block">${escapeJson(c.new_value)}</pre></td>
                <td>
                  <button class="admin-btn admin-btn-small admin-btn-success" data-action="approve-field" data-draft-id="${draft.id}" data-field="${c.field_name}">Approve</button>
                  <button class="admin-btn admin-btn-small admin-btn-error" data-action="reject-field" data-draft-id="${draft.id}" data-field="${c.field_name}">Reject</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      changesHtml = `<pre class="admin-code-block">${escapeHtml(dataJson)}</pre>`;
    }

    // Build actions
    let actionsHtml = '';
    if (draft.workflow_status === 'needs_verification' && draft.draft_type === 'update') {
      actionsHtml = `<button class="admin-btn admin-btn-primary" data-action="verify-draft" data-draft-id="${draft.id}">Verify (Create Diff)</button>`;
    } else if (draft.workflow_status === 'ready_for_review' && draft.approval_status === 'pending') {
      actionsHtml = `
        <button class="admin-btn admin-btn-success" data-action="approve-draft" data-draft-id="${draft.id}">Approve</button>
        <button class="admin-btn admin-btn-error" data-action="reject-draft" data-draft-id="${draft.id}">Reject</button>
      `;
    } else if (draft.approval_status === 'approved' && draft.workflow_status !== 'published') {
      actionsHtml = `<button class="admin-btn admin-btn-primary" data-action="publish-draft" data-draft-id="${draft.id}">Publish</button>`;
    }

    // Show modal (or create it inline)
    let modal = document.getElementById('cm-draft-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cm-draft-modal';
      modal.className = 'admin-modal-overlay';
      modal.innerHTML = `
        <div class="admin-modal">
          <div class="admin-modal-header">
            <h3 id="cm-modal-title">Draft Details</h3>
            <button class="admin-modal-close" data-action="close-modal">&times;</button>
          </div>
          <div class="admin-modal-body" id="cm-modal-body"></div>
          <div class="admin-modal-footer" id="cm-modal-footer"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Close handler
      modal.querySelector('[data-action="close-modal"]').addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    document.getElementById('cm-modal-title').textContent = `${draft.draft_type === 'update' ? 'Update' : 'New'} ${draft.target_entity} — ${draft.id.slice(0, 8)}`;
    document.getElementById('cm-modal-body').innerHTML = `
      <div class="admin-grid">
        <div>
          <h4>Draft Data</h4>
          ${changesHtml}
        </div>
        <div>
          <h4>Metadata</h4>
          <dl class="admin-dl">
            <dt>Source:</dt><dd>${draft.source_url ? `<a href="${escapeHtml(draft.source_url)}" target="_blank">${escapeHtml(draft.source_name || '—')}</a>` : '—'}</dd>
            <dt>AI Model:</dt><dd>${escapeHtml(draft.ai_model || '—')}</dd>
            <dt>Workflow Status:</dt><dd>${statusBadge(draft.workflow_status)}</dd>
            <dt>Approval:</dt><dd>${statusBadge(draft.approval_status, 'approval')}</dd>
            <dt>Version:</dt><dd>${draft.version}</dd>
            <dt>Research Date:</dt><dd>${formatDate(draft.research_date)}</dd>
            <dt>Verified:</dt><dd>${draft.verification_date ? formatDate(draft.verification_date) : '—'}</dd>
          </dl>
        </div>
      </div>
    `;
    document.getElementById('cm-modal-footer').innerHTML = actionsHtml + '<div style="margin-top: 8px;">🔒 Forbidden fields are always null.</div>';
    modal.style.display = 'flex';

    // Attach action listeners
    const modalActions = modal.querySelectorAll('[data-action]');
    modalActions.forEach((el) => {
      el.addEventListener('click', handleModalAction);
    });
  } catch (error) {
    showError(`Error loading draft: ${error.message}`);
  }
}

function escapeJson(obj) {
  return escapeHtml(JSON.stringify(obj));
}

// --- Modal actions ---

async function handleModalAction(e) {
  const action = e.target.dataset.action;
  const draftId = e.target.dataset.draftId;
  const field = e.target.dataset.field;

  try {
    if (action === 'close-modal') {
      document.getElementById('cm-draft-modal').style.display = 'none';
      return;
    }

    if (action === 'verify-draft') {
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'verify', draft_id: draftId },
      });
      showSuccess('Draft verified with before/after changes.');
      await loadDrafts();
      await loadVerificationQueue();
      document.getElementById('cm-draft-modal').style.display = 'none';
      return;
    }

    if (action === 'approve-field') {
      const reason = field === 'all' ? null : prompt('Optional note for this field approval:');
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'approve_field', draft_id: draftId, field_name: field, notes: reason },
      });
      // Refresh
      await openDraftModal(draftId);
      return;
    }

    if (action === 'reject-field') {
      const reason = prompt('Reason for rejecting this field:');
      if (!reason) return;
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'reject_field', draft_id: draftId, field_name: field, reason },
      });
      await openDraftModal(draftId);
      return;
    }

    if (action === 'approve-draft') {
      const notes = prompt('Optional approval notes:');
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'approve', draft_id: draftId, notes, publish_immediately: false },
      });
      showSuccess('Draft approved.');
      await loadDrafts();
      await loadApprovalQueue();
      document.getElementById('cm-draft-modal').style.display = 'none';
      return;
    }

    if (action === 'reject-draft') {
      const reason = prompt('Reason for rejecting this draft:');
      if (!reason) return;
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'reject', draft_id: draftId, reason },
      });
      showSuccess('Draft rejected.');
      await loadDrafts();
      await loadApprovalQueue();
      document.getElementById('cm-draft-modal').style.display = 'none';
      return;
    }

    if (action === 'publish-draft') {
      if (!confirm('Publish this draft to the live content table? This action cannot be undone.')) return;
      await api('/cm-approval', {
        method: 'POST',
        body: { action: 'publish', draft_id: draftId },
      });
      showSuccess('Draft published to content table.');
      await loadDrafts();
      await loadPublished();
      document.getElementById('cm-draft-modal').style.display = 'none';
      return;
    }
  } catch (error) {
    showError(`Action failed: ${error.message}`);
  }
}

// --- Verification Queue ---

async function loadVerificationQueue() {
  const container = document.getElementById('cm-verification-list');
  if (!container) return;

  container.innerHTML = '<p class="admin-text-muted">Loading verification queue…</p>';

  try {
    const { drafts } = await api('/cm-drafts?workflow_status=needs_verification');

    if (!drafts.length) {
      container.innerHTML = '<p class="admin-text-muted">No drafts in verification queue.</p>';
      return;
    }

    container.innerHTML = drafts.map((draft) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <span class="admin-badge admin-badge-warning">Needs Verification</span>
          <span class="admin-badge admin-badge-secondary">${escapeHtml(draft.target_entity)}</span>
        </div>
        <div class="admin-card-body">
          <p><strong>Source:</strong> ${draft.source_url ? `<a href="${escapeHtml(draft.source_url)}" target="_blank">${escapeHtml(draft.source_name || '—')}</a>` : '—'}</p>
          <p><strong>AI Model:</strong> ${escapeHtml(draft.ai_model || '—')}</p>
          <p><strong>Created:</strong> ${formatDate(draft.created_at)}</p>
          ${draft.draft_type === 'update'
            ? `<p><strong>This is an UPDATE proposal.</strong> Click to review before/after changes.</p>`
            : `<p><strong>NEW listing proposal.</strong> Review draft data before sending for review.</p>`
          }
        </div>
        <div class="admin-card-footer">
          <button class="admin-btn admin-btn-primary admin-btn-small" onclick="openDraftModal('${draft.id}')">Review</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</div>`;
  }
}

// --- Pending Approval ---

async function loadApprovalQueue() {
  const container = document.getElementById('cm-approval-list');
  if (!container) return;

  container.innerHTML = '<p class="admin-text-muted">Loading approval queue…</p>';

  try {
    const { drafts } = await api('/cm-drafts?workflow_status=ready_for_review&approval_status=pending');

    if (!drafts.length) {
      container.innerHTML = '<p class="admin-text-muted">No drafts pending approval.</p>';
      return;
    }

    container.innerHTML = drafts.map((draft) => `
      <div class="admin-card">
        <div class="admin-card-header">
          <span class="admin-badge admin-badge-info">Ready for Review</span>
          <span class="admin-badge admin-badge-secondary">${escapeHtml(draft.target_entity)}</span>
        </div>
        <div class="admin-card-body">
          <h4>⚠️ ADMIN APPROVAL REQUIRED</h4>
          <p>This AI-generated draft must be manually reviewed before publishing.</p>
          <p><strong>Source:</strong> ${draft.source_url ? `<a href="${escapeHtml(draft.source_url)}" target="_blank">${escapeHtml(draft.source_name || '—')}</a>` : '—'}</p>
          <p><strong>AI Model:</strong> ${escapeHtml(draft.ai_model || '—')} · <strong>Task:</strong> ${escapeHtml(draft.ai_task_type || '—')}</p>
          <div class="admin-alert admin-alert-warning admin-alert-dense">
            Forbidden fields check: all price, availability, booking-link, hours,
            permits, visa, distance, travel-time, and facility fields are masked to null.
          </div>
        </div>
        <div class="admin-card-footer">
          <button class="admin-btn admin-btn-success admin-btn-small" onclick="openDraftModal('${draft.id}')">Review & Approve</button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = `<div class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</div>`;
  }
}

// --- Published ---

async function loadPublished() {
  const tbody = document.getElementById('cm-published-tbody');
  if (!tbody) return;

  try {
    // Drafts with workflow_status = 'published'
    const { drafts } = await api('/cm-drafts?workflow_status=published&limit=100');

    if (!drafts.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="admin-text-muted">No published drafts yet.</td></tr>';
      return;
    }

    tbody.innerHTML = drafts.map((draft) => `
      <tr data-draft-id="${draft.id}">
        <td>${statusBadge(draft.target_entity, 'entity')}</td>
        <td>${escapeHtml(String(draft.target_id || '—'))}</td>
        <td>
          ${draft.source_url
            ? `<a href="${escapeHtml(draft.source_url)}" target="_blank" class="admin-link admin-link-small">${escapeHtml(draft.source_name || new URL(draft.source_url).hostname)}</a>`
            : '—'
          }
        </td>
        <td>${formatDate(draft.published_at)}</td>
        <td>${draft.published_by ? `<small class="admin-text-muted">${draft.published_by.slice(0, 8)}…</small>` : '—'}</td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</td></tr>`;
  }
}

// --- Sources ---

async function loadSources() {
  const tbody = document.getElementById('cm-sources-tbody');
  if (!tbody) return;

  try {
    const { sources } = await api('/cm-sources?limit=100');

    if (!sources.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="admin-text-muted">No verified sources yet.</td></tr>';
      return;
    }

    tbody.innerHTML = sources.map((s) => `
      <tr data-source="${escapeHtml(s.url)}">
        <td>${escapeHtml(s.domain)}</td>
        <td>${escapeHtml(s.name)}</td>
        <td><a href="${escapeHtml(s.url)}" target="_blank" class="admin-link admin-link-small">${escapeHtml(s.url.slice(0, 60))}</a></td>
        <td>${s.verified ? statusBadge('published') : statusBadge('draft')}</td>
        <td><small class="admin-text-muted">${formatDate(s.last_checked_at) || formatDate(s.created_at)}</small></td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</td></tr>`;
  }
}

// --- Activity Log ---

async function loadActivityLog() {
  const tbody = document.getElementById('cm-activity-tbody');
  if (!tbody) return;

  try {
    // Fetch via direct query — activity log doesn't have a dedicated endpoint
    // so we use the research queue as the closest proxy, or we extend
    // the sources endpoint. For now, we fetch from cm-research which has
    // created_at timestamps as a fallback.
    // In production, this would call a dedicated activity log endpoint.
    const { queue } = await api('/cm-research?status=matched&limit=50');

    if (!queue.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="admin-text-muted">No activity yet.</td></tr>';
      return;
    }

    tbody.innerHTML = queue.map((item) => `
      <tr>
        <td><span class="admin-badge admin-badge-info">${escapeHtml(item.status)}</span></td>
        <td>${escapeHtml(item.target_entity)}</td>
        <td><small class="admin-text-muted">${formatDate(item.created_at)}</small></td>
        <td><small class="admin-text-muted">${item.created_by ? item.created_by.slice(0, 8) + '…' : 'system'}</small></td>
        <td><small class="admin-text-muted">${escapeHtml(item.error_message || '')}</small></td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5" class="admin-alert admin-alert-error">Error: ${escapeHtml(error.message)}</td></tr>`;
  }
}

// --- Utility: toasts/notifications ---

function showSuccess(message) {
  const existing = document.querySelector('.cm-toast-success');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'cm-toast cm-toast-success';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

function showError(message) {
  const existing = document.querySelector('.cm-toast-error');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'cm-toast cm-toast-error';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 8000);
}

// --- Logout ---

function initLogout() {
  const btn = document.getElementById('cm-logout-btn');
  const emailEl = document.getElementById('cm-user-email');
  if (emailEl) emailEl.textContent = localStorage.getItem(USER_KEY) || '';

  btn?.addEventListener('click', async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/admin/auth';
  });
}

// --- Init ---

document.addEventListener('DOMContentLoaded', async () => {
  const loading = document.getElementById('cm-loading');
  const unauthorized = document.getElementById('cm-unauthorized');
  const interface = document.getElementById('cm-interface');

  loading.style.display = 'block';
  interface.style.display = 'none';

  const token = await checkAuth();
  if (!token) {
    unauthorized.style.display = 'block';
    loading.style.display = 'none';
    return;
  }

  // Auth succeeded — show the interface
  loading.style.display = 'none';
  interface.style.display = 'block';

  initTabs();
  initLogout();
  submitResearchForm();

  // Attach filter listeners
  document.getElementById('cm-drafts-status-filter')?.addEventListener('change', loadDrafts);
  document.getElementById('cm-drafts-entity-filter')?.addEventListener('change', loadDrafts);

  // Load default tab (research queue)
  await loadResearchQueue();
});
