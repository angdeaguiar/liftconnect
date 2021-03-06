create database liftconnect;

\c liftconnect;

create extension pgcrypto;

create type pronoun as enum ('she/her', 'he/him', 'they/them');

create table users (
    id uuid default public.gen_random_uuid() primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(50) not null unique,
    password varchar(200) not null,
    city varchar(50) not null,
    pronouns pronoun,
    created_at timestamptz default now()
);

create table personal_records (
    id uuid default public.gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    squat int,
    deadlift int,
    bench int
);

create table user_followings (
    following_id uuid not null references users (id),
    user_id uuid not null references users (id),

    primary key (following_id, user_id)
);

create table user_workouts (
    id uuid default public.gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    title varchar(100),
    notes text,
    created_at timestamptz default now()
);

create table workout_exercises (
    id uuid default public.gen_random_uuid() primary key,
    workout_id uuid not null references user_workouts (id),
    api_id varchar(36) not null,
    name text,
    gif_url varchar(150)
);

create table workout_sets (
    id uuid default public.gen_random_uuid(),
    exercise_id uuid not null references workout_exercises (id),
    set_number int,
    reps int,
    weight int,

    primary key (id, exercise_id)
);

create table files (
    id uuid default public.gen_random_uuid() primary key,
    filename text not null,
    s3_url text not null,
    file_type varchar(10),
    size numeric
);

create table posts (
    id uuid default public.gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    file_id uuid references files (id),
    title varchar(50),
    content text,
    created_at timestamptz default now()
);

create table comments (
    id uuid default public.gen_random_uuid() primary key,
    user_id uuid not null references users (id),
    post_id uuid not null references posts (id),
    content text,
    created_at timestamptz default now()
);