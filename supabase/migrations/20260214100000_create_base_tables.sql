-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  is_priest BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  priest_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Events table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  imageurl TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Event registrations
CREATE TABLE public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unregister" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

-- Services table
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🙏',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);

-- Service bookings
CREATE TABLE public.service_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  booking_date TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.service_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.service_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Teachings table
CREATE TABLE public.teachings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  imageurl TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teachings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teachings" ON public.teachings FOR SELECT USING (true);

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Legacy priests table
CREATE TABLE public.priests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.priests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view priests" ON public.priests FOR SELECT USING (true);

-- Priest profiles
CREATE TABLE public.priest_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  base_price NUMERIC DEFAULT 0,
  avatar_url TEXT DEFAULT '/placeholder.svg',
  availability TEXT DEFAULT '',
  location TEXT DEFAULT '',
  rating NUMERIC DEFAULT 0,
  approval_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.priest_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved priests" ON public.priest_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own priest profile" ON public.priest_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create priest profile" ON public.priest_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Priest bookings
CREATE TABLE public.priest_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  priest_id UUID NOT NULL REFERENCES public.priest_profiles(id) ON DELETE CASCADE,
  booking_date TIMESTAMPTZ NOT NULL,
  purpose TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  price NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.priest_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own priest bookings" ON public.priest_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Priests can view their bookings" ON public.priest_bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.priest_profiles WHERE id = priest_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create priest bookings" ON public.priest_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Priests can update their bookings" ON public.priest_bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.priest_profiles WHERE id = priest_id AND user_id = auth.uid())
);

-- Helper function: update priest status
CREATE OR REPLACE FUNCTION public.update_priest_status(
  p_user_id UUID,
  p_new_status TEXT,
  p_is_priest_value BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET priest_status = p_new_status, is_priest = p_is_priest_value, updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
