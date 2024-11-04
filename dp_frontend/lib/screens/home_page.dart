import 'package:flutter/material.dart';
import 'event_details_page.dart';
import '../models/user.dart';
import 'attendees_page.dart'; // Import for attendees page

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
        backgroundColor: Colors.red, // Set AppBar color to red
        actions: [
          IconButton(
            icon: Icon(Icons.person,),
            onPressed: () {
              final user = User(username: 'SampleUser', email: 'user@example.com', password: 'password123');
              Navigator.pushNamed(context, '/profile', arguments: user);
            },
          ),
        ],
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Background Image
          Image.asset(
            'assets/images/backgroundimage.jpg', // Path to your background image
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) {
              return Center(
                child: Text(
                  'Image not available',
                  style: TextStyle(color: Colors.white),
                ),
              );
            },
          ),
          // Semi-transparent overlay for readability
          Container(
            color: Colors.white.withOpacity(0.5), // Dark overlay for better text visibility
          ),
          // List of events
          ListView.builder(
            itemCount: events.length,
            itemBuilder: (context, index) {
              final event = events[index];
              return Card(
                margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12), // Rounded corners
                ),
                elevation: 4, // Adds slight shadow for depth
                child: ListTile(
                  title: Text(
                    event['title']!,
                    style: TextStyle(fontWeight: FontWeight.bold, color: Colors.black), // Change title text color
                  ),
                  subtitle: Text(
                    '${event['date']} - ${event['location']}',
                    style: TextStyle(color: Colors.black), // Change subtitle text color
                  ),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => EventDetailsPage(event: event),
                      ),
                    );
                  },
                  trailing: IconButton(
                    icon: Icon(Icons.people, color: Colors.red), // Optional color change
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
        ],
      ),
    );
  }
}
