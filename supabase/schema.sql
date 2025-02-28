-- Content Types enum
create type content_type as enum (
  'small_schools_article',
  'kevons_newsletter',
  'kevons_personal_essay',
  'kevons_social_posts'
);

-- Guidelines table
create table guidelines (
  id uuid primary key default uuid_generate_v4(),
  content_type content_type not null unique,
  guideline text not null,
  examples text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Phrases table
create table phrases (
  id uuid primary key default uuid_generate_v4(),
  phrase text not null,
  created_at timestamp with time zone default now()
);

-- Content table
create table content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  input_text text not null,
  output_text text not null,
  content_type content_type not null,
  is_posted boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
); 