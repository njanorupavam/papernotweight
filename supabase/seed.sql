with first_user as (select id from auth.users order by created_at limit 1)
insert into public.catches (user_id, mosquito_count, caught_at, catch_method, city, country, public_latitude, public_longitude)
select first_user.id, seed.* from first_user cross join (values
  (284, now() - interval '1 hour', 'Electric bat', 'Thiruvananthapuram', 'IN', 8.5241, 76.9366),
  (192, now() - interval '2 hours', 'Trap', 'Kochi', 'IN', 9.9312, 76.2673),
  (156, now() - interval '4 hours', 'Hand', 'Bengaluru', 'IN', 12.9716, 77.5946),
  (134, now() - interval '6 hours', 'Electric bat', 'Chennai', 'IN', 13.0827, 80.2707),
  (108, now() - interval '8 hours', 'Spray', 'Mumbai', 'IN', 19.0760, 72.8777),
  (94, now() - interval '9 hours', 'Coil', 'Delhi', 'IN', 28.6139, 77.2090),
  (188, now() - interval '3 hours', 'Electric bat', 'Singapore', 'SG', 1.3521, 103.8198),
  (143, now() - interval '5 hours', 'Trap', 'Kuala Lumpur', 'MY', 3.1390, 101.6869),
  (121, now() - interval '7 hours', 'Hand', 'Bangkok', 'TH', 13.7563, 100.5018),
  (87, now() - interval '12 hours', 'Spray', 'London', 'GB', 51.5074, -0.1278),
  (76, now() - interval '14 hours', 'Electric bat', 'New York', 'US', 40.7128, -74.0060)
) as seed(mosquito_count, caught_at, catch_method, city, country, public_latitude, public_longitude);
