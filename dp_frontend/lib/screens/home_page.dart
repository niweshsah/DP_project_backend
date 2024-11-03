// lib/screens/home_page.dart

import 'package:flutter/material.dart';
import 'event_details_page.dart';
import '../models/user.dart';
import 'attendees_page.dart'; // New import for attendees page

class HomePage extends StatelessWidget {
  final List<Map<String, String>> events = [
    {'title': 'Music Concert', 'date': '2024-11-15', 'location': 'Hall A'},
    {'title': 'Art Exhibition', 'date': '2024-12-01', 'location': 'Gallery'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
        actions: [
          IconButton(
            icon: Icon(Icons.person),
            onPressed: () {
              final user = User(username: 'SampleUser', email: 'user@example.com', password: 'password123');
              Navigator.pushNamed(context, '/profile', arguments: user);
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: events.length,
        itemBuilder: (context, index) {
          final event = events[index];
          return Card(
            margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: ListTile(
              title: Text(event['title']!),
              subtitle: Text('${event['date']} - ${event['location']}'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => EventDetailsPage(event: event),
                  ),
                );
              },
              trailing: IconButton(
                icon: Icon(Icons.people),
                tooltip: 'View Attendees',
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AttendeesPage(eventTitle: event['title']!),
                    ),
                  );
                },
              ),
            ),
          );
        },
      ),
    );
  }
}
