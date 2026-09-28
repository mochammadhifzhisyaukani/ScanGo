CREATE TABLE IF NOT EXISTS public.attendances (
    id BIGSERIAL PRIMARY KEY,
    idcard TEXT NOT NULL,
    mac_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Hadir',
    note TEXT,
    time_finish TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom yang mungkin belum ada (idempotent)
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS idcard TEXT;
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS mac_address TEXT;
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Hadir';
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS time_finish TIMESTAMPTZ;
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Index untuk pencarian cepat berdasarkan idcard & tanggal
CREATE INDEX IF NOT EXISTS idx_attendances_idcard ON public.attendances (idcard);
CREATE INDEX IF NOT EXISTS idx_attendances_created_at ON public.attendances (created_at);

-- Optional: foreign key jika kolom users.idcard ada
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'idcard'
    ) THEN
        ALTER TABLE public.attendances
        ADD CONSTRAINT fk_attendances_idcard
        FOREIGN KEY (idcard) REFERENCES public.users(idcard)
        ON DELETE CASCADE;
    END IF;
END $$;
