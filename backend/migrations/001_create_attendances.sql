CREATE TABLE IF NOT EXISTS public.attendances (
    id BIGSERIAL PRIMARY KEY,
    card_id TEXT NOT NULL,
    mac_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'hadir',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups by card_id
CREATE INDEX IF NOT EXISTS idx_attendances_card_id ON public.attendances (card_id);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_attendances_created_at ON public.attendances (created_at);

-- Optional: foreign key if users.idcard exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'idcard'
    ) THEN
        ALTER TABLE public.attendances
        ADD CONSTRAINT fk_attendances_card_id
        FOREIGN KEY (card_id) REFERENCES public.users(idcard)
        ON DELETE CASCADE;
    END IF;
END $$;
