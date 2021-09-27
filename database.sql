drop database liftconnect;

create database liftconnect;

\c liftconnect;

create type pronoun as enum ('she/her', 'he/him', 'they/them');

create table users (
    id uuid not null,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(50) not null,
    city varchar(50) not null,
    pronouns pronoun,
    created_at timestamptz default now
);

create table personal_records (
    id uuid not null,
    user_id uuid references users (id) not null,
    squat int,
    deadlift int,
    bench int
);

create table user_followings (
    following_id uuid references users (id) not null,
    user_id uuid references users (id) not null
);

create table user_workouts (
    id uuid not null,
    user_id uuid references users (id) not null,
    title varchar(100),
    notes text,
    created_at timestamptz default now
);

create table workout_exercises (
    id uuid not null,
    workout_id uuid references user_workouts (id) not null,
    api_id varchar(36),
    name varchar(50),
    sets int,
    reps int,
    weight int,
);

create table posts (
    id uuid not null,
    user_id uuid references users (id) not null,
    title varchar(50),
    content text,
    created_at timestamptz default now,
);

create table comments (
    id uuid not null,
    user_id uuid references users (id) not null,
    post_id uuid references posts (id) not null,
    content text,
    created_at timestamptz default now
);