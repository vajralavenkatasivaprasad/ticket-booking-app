USE ticket_booking_db;

INSERT INTO events (id, event_name, department_name, event_date, event_time, venue, ticket_price, total_tickets, available_tickets, description, latitude, longitude)
VALUES (1, 'Tech Fest 2026', 'Computer Science Department', '2026-06-15', '10:00:00', 'Main Auditorium, College Campus', 200, 250, 250, 'Internal department technical fest with workshops, coding contest, project expo and seminar sessions.', 9.9252, 78.1198)
ON DUPLICATE KEY UPDATE event_name=VALUES(event_name);
