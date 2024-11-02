// lib/screens/home_page.dart

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'event_details_page.dart';
import '../widgets/event_card.dart';
import '../models/event.dart';

class HomePage extends StatelessWidget {
  final ApiService apiService = ApiService();

  @override
  Widget build(BuildContext context) {
    // Fetching the events directly (using mock data)
    List<Event> events = apiService.fetchEvents();

    return Scaffold(
      appBar: AppBar(
        title: Text('Event Management'),
      ),
      body: ListView.builder(
        itemCount: events.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => EventDetailPage(event: events[index]),
                ),
              );
            },
            child: EventCard(event: events[index]),
          );
        },
      ),
    );
  }
}
