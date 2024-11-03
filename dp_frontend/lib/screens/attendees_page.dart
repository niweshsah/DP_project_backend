// lib/screens/attendees_page.dart

import 'package:flutter/material.dart';

class AttendeesPage extends StatefulWidget {
  final String eventTitle;

  AttendeesPage({required this.eventTitle});

  @override
  _AttendeesPageState createState() => _AttendeesPageState();
}

class _AttendeesPageState extends State<AttendeesPage> {
  // Dummy data for attendees
  List<Map<String, dynamic>> attendees = [
    {'name': 'Alice', 'attended': false},
    {'name': 'Bob', 'attended': true},
    {'name': 'Charlie', 'attended': false},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.eventTitle} Attendees'),
      ),
      body: ListView.builder(
        itemCount: attendees.length,
        itemBuilder: (context, index) {
          final attendee = attendees[index];
          return ListTile(
            title: Text(attendee['name']),
            trailing: Checkbox(
              value: attendee['attended'],
              onChanged: (bool? value) {
                setState(() {
                  attendee['attended'] = value!;
                });
              },
            ),
          );
        },
      ),
    );
  }
}
