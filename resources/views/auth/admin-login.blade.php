@extends('layouts.site')

@section('content')
<section class="admin-shell">
    <div class="container" style="max-width: 640px;">
        <div class="admin-header">
            <div>
                <p class="eyebrow">Admin Access</p>
                <h1>Sign in to Trek Africa Guide CMS</h1>
                <p>Use an admin account to manage regions, countries, listings, homepage sections, and brand assets.</p>
            </div>
        </div>

        <div class="admin-panel">
            <form action="{{ route('admin.login.store') }}" method="POST" class="admin-form">
                @csrf
                <input name="email" type="email" placeholder="Admin email" value="{{ old('email') }}" required>
                <input name="password" type="password" placeholder="Password" required>
                <label class="checkbox-row">
                    <input type="checkbox" name="remember" value="1"> Keep me signed in
                </label>
                @if($errors->any())
                    <div class="admin-status" style="background:#5a231d;color:#fff;">
                        {{ $errors->first() }}
                    </div>
                @endif
                <button class="button button--full" type="submit">Sign in</button>
            </form>
        </div>
    </div>
</section>
@endsection
