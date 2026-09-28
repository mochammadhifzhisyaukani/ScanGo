-- Index komposit untuk lookup absensi harian per kartu (dipakai endpoint tap & store)
CREATE INDEX IF NOT EXISTS idx_attendances_idcard_created_at
    ON public.attendances (idcard, created_at DESC);

-- Index pelengkap untuk tabel users (lookup by idcard/username/nis)
CREATE INDEX IF NOT EXISTS idx_users_idcard ON public.users (idcard);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
CREATE INDEX IF NOT EXISTS idx_users_nis ON public.users (nis);
