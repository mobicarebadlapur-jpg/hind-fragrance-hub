
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin','partner','customer','staff');
CREATE TYPE public.membership_status AS ENUM ('pending','payment_pending','active','suspended','cancelled');
CREATE TYPE public.order_status AS ENUM ('created','payment_pending','paid','processing','shipped','delivered','cancelled','refunded','returned');
CREATE TYPE public.commission_status AS ENUM ('pending','approved','available','paid','cancelled','reversed');
CREATE TYPE public.payout_status AS ENUM ('requested','under_review','approved','processing','paid','rejected');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  mobile text,
  email text,
  address text, city text, state text, pincode text,
  blocked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile write" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- SETTINGS
CREATE TABLE public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO anon, authenticated;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.app_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.app_settings(key, value) VALUES
 ('brand', '{"name":"Hind Fragrance","currency":"INR","contact_email":"support@hindfragrance.com","contact_phone":"+91 90000 00000"}'),
 ('membership', '{"price":199,"name":"Business Partner Membership","active":true}'),
 ('commission', '{"default_percent":10,"min_payout":500,"holding_days":7,"allow_product_specific":true,"allow_category_specific":true,"basis":"product_subtotal","exclude_shipping":true,"exclude_tax":true,"exclude_discounts":true}'),
 ('referral', '{"cookie_days":30,"attribution":"last_click"}'),
 ('payment', '{"provider":"razorpay","demo_mode":true}');

-- PARTNERS
CREATE SEQUENCE public.partner_id_seq START 10001;
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  partner_code text NOT NULL UNIQUE,
  referral_code text NOT NULL UNIQUE,
  status public.membership_status NOT NULL DEFAULT 'pending',
  membership_price numeric(12,2),
  membership_date timestamptz,
  payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.partners TO authenticated;
GRANT SELECT ON public.partners TO anon;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "partner own read" ON public.partners FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "partner anon lookup" ON public.partners FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "partner self insert" ON public.partners FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "partner admin update" ON public.partners FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sku text NOT NULL,
  category text NOT NULL,
  short_description text,
  description text,
  image_url text,
  price numeric(12,2) NOT NULL,
  sale_price numeric(12,2),
  stock int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  featured boolean NOT NULL DEFAULT false,
  commission_percent numeric(6,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ORDERS
CREATE SEQUENCE public.order_number_seq START 1001;
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('HFO' || nextval('public.order_number_seq')),
  customer_id uuid NOT NULL,
  referral_code text,
  partner_id uuid REFERENCES public.partners(id),
  subtotal numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2) NOT NULL DEFAULT 0,
  tax numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status public.order_status NOT NULL DEFAULT 'created',
  payment_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders read" ON public.orders FOR SELECT TO authenticated
  USING (customer_id = auth.uid() OR public.has_role(auth.uid(),'admin')
    OR partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()));
CREATE POLICY "orders insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders admin update" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR customer_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(),'admin') OR customer_id = auth.uid());
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  product_name text NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  quantity int NOT NULL,
  line_total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items read" ON public.order_items FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()
      OR partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid()))
    OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "order items insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- COMMISSIONS
CREATE TABLE public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.partners(id),
  customer_id uuid NOT NULL,
  order_amount numeric(12,2) NOT NULL,
  percent numeric(6,2) NOT NULL,
  amount numeric(12,2) NOT NULL,
  status public.commission_status NOT NULL DEFAULT 'pending',
  available_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.commissions TO authenticated;
GRANT ALL ON public.commissions TO service_role;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commissions read" ON public.commissions FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "commissions admin update" ON public.commissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER commissions_updated BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- COMMISSION ENGINE (server-side, settings driven)
CREATE OR REPLACE FUNCTION public.handle_order_commission()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  cfg jsonb;
  default_pct numeric;
  holding int;
  pct numeric;
  base numeric;
  partner_user uuid;
  weighted numeric := 0;
  item record;
BEGIN
  SELECT value INTO cfg FROM public.app_settings WHERE key = 'commission';
  default_pct := COALESCE((cfg->>'default_percent')::numeric, 10);
  holding := COALESCE((cfg->>'holding_days')::int, 7);

  -- Reverse commission when order is cancelled / refunded / returned
  IF NEW.status IN ('cancelled','refunded','returned') THEN
    UPDATE public.commissions SET status = 'reversed'
      WHERE order_id = NEW.id AND status <> 'paid';
    RETURN NEW;
  END IF;

  -- Create commission once, when the order is paid
  IF NEW.status = 'paid' AND OLD.status IS DISTINCT FROM 'paid' AND NEW.partner_id IS NOT NULL THEN
    SELECT user_id INTO partner_user FROM public.partners WHERE id = NEW.partner_id AND status = 'active';
    -- no partner, inactive partner, or self-referral => no commission
    IF partner_user IS NULL OR partner_user = NEW.customer_id THEN RETURN NEW; END IF;
    IF EXISTS (SELECT 1 FROM public.commissions WHERE order_id = NEW.id) THEN RETURN NEW; END IF;

    base := NEW.subtotal;
    -- weighted percent: product-specific overrides fall back to default
    FOR item IN
      SELECT oi.line_total, p.commission_percent
      FROM public.order_items oi LEFT JOIN public.products p ON p.id = oi.product_id
      WHERE oi.order_id = NEW.id
    LOOP
      weighted := weighted + item.line_total * COALESCE(item.commission_percent, default_pct);
    END LOOP;

    IF base > 0 AND weighted > 0 THEN pct := round(weighted / base, 2); ELSE pct := default_pct; END IF;

    INSERT INTO public.commissions(order_id, partner_id, customer_id, order_amount, percent, amount, status, available_at)
    VALUES (NEW.id, NEW.partner_id, NEW.customer_id, base, pct, round(base * pct / 100, 2), 'pending', now() + (holding || ' days')::interval);

    INSERT INTO public.notifications(user_id, title, body, type)
    VALUES (partner_user, 'New commission earned',
      'Order ' || NEW.order_number || ' generated a commission of Rs ' || round(base * pct / 100, 2), 'commission');
  END IF;
  RETURN NEW;
END; $$;

-- PAYOUTS
CREATE TABLE public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id),
  amount numeric(12,2) NOT NULL,
  method text NOT NULL,
  account_holder text, bank_name text, account_number text, ifsc text, upi_id text,
  status public.payout_status NOT NULL DEFAULT 'requested',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payouts TO authenticated;
GRANT ALL ON public.payouts TO service_role;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payouts read" ON public.payouts FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "payouts insert" ON public.payouts FOR INSERT TO authenticated
  WITH CHECK (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid() AND status = 'active'));
CREATE POLICY "payouts admin update" ON public.payouts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER payouts_updated BEFORE UPDATE ON public.payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  partner_id uuid REFERENCES public.partners(id),
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  gateway text NOT NULL DEFAULT 'demo',
  gateway_order_id text,
  gateway_payment_id text,
  status text NOT NULL DEFAULT 'success',
  payment_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions read" ON public.transactions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- REFERRAL CLICKS
CREATE TABLE public.referral_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code text NOT NULL,
  partner_id uuid REFERENCES public.partners(id),
  landing_page text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.referral_clicks TO anon, authenticated;
GRANT ALL ON public.referral_clicks TO service_role;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clicks insert" ON public.referral_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "clicks read" ON public.referral_clicks FOR SELECT TO authenticated
  USING (partner_id IN (SELECT id FROM public.partners WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(),'admin'));

-- MARKETING ASSETS
CREATE TABLE public.marketing_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'banner',
  image_url text,
  file_url text,
  body_text text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.marketing_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.marketing_assets TO authenticated;
GRANT ALL ON public.marketing_assets TO service_role;
ALTER TABLE public.marketing_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assets read" ON public.marketing_assets FOR SELECT TO anon, authenticated USING (status = 'active' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "assets admin write" ON public.marketing_assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'general',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TRIGGER orders_commission AFTER UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_commission();

-- OTP
CREATE TABLE public.otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.otp_verifications TO service_role;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- AUDIT LOGS
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  target text,
  old_value jsonb,
  new_value jsonb,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "audit admin insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

-- DEMO PRODUCTS
INSERT INTO public.products (name, slug, sku, category, short_description, description, price, sale_price, stock, featured, commission_percent) VALUES
 ('Imperial Oud','imperial-oud','HF-IO-001','Attar','Deep smoky oud with amber warmth','A regal alcohol-free attar built on aged oud, amber and a whisper of saffron. Long lasting, skin-close and unmistakably premium.',1200,1000,50,true,null),
 ('Shanaya','shanaya','HF-SH-002','Perfume','Rose, lychee and soft musk','An elegant alcohol-free perfume for everyday grace: Bulgarian rose, juicy lychee and clean musk.',899,749,80,true,12),
 ('Aura Bloom','aura-bloom','HF-AB-003','Perfume','Fresh white florals with citrus lift','Jasmine and neroli lifted by bergamot. Bright, modern and effortlessly wearable.',799,null,60,true,null),
 ('Mogra Bloom','mogra-bloom','HF-MB-004','Attar','Pure Indian mogra','Classic mogra attar, distilled the traditional way. Pure, powerful and nostalgic.',650,599,120,false,null),
 ('Alzahoor','alzahoor','HF-AZ-005','Attar','Arabian floral bouquet','A rich Arabian floral blend of taif rose, ylang and musk in an alcohol-free base.',1500,1299,30,true,15),
 ('Royal Musk Room Mist','royal-musk-room-mist','HF-RM-006','Room Freshener','Musky home fragrance mist','Transform any room with a soft musk and amber mist. Alcohol-free, long lingering.',499,null,200,false,null),
 ('Signature Gift Set','signature-gift-set','HF-GS-007','Gift Sets','Three bestsellers in a luxury box','Imperial Oud, Shanaya and Mogra Bloom presented in a gold-foiled gift box.',2499,2199,25,true,8);

INSERT INTO public.marketing_assets (title, description, category, body_text) VALUES
 ('WhatsApp Product Blast','Ready-to-send WhatsApp message for your customers','whatsapp','Assalamualaikum! Discover Hind Fragrance alcohol-free attars & perfumes - long lasting, premium and made in India. Shop here:'),
 ('Festive Banner Copy','Caption for festive season social posts','social','This festive season, gift a fragrance that lasts. Hind Fragrance alcohol-free attars & perfumes.'),
 ('Product Description Pack','Copy-paste descriptions for all bestsellers','description','Imperial Oud - aged oud, amber and saffron. Alcohol-free, 12h+ longevity.');
