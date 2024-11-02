// lib/screens/event_details_page.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // for date formatting
import '../models/event.dart';

class EventDetailPage extends StatelessWidget {
  final Event event;

  const EventDetailPage({Key? key, required this.event}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Format date and time
    final String formattedDate = DateFormat.yMMMMd().format(event.date);
    final String formattedTime = '${event.time.hour}:${event.time.minute.toString().padLeft(2, '0')}';

    return Scaffold(
      appBar: AppBar(
        title: Text(event.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              event.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Date: $formattedDate',
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 8),
            Text(
              'Time: $formattedTime',
              style: const TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 16),
            Text(
              event.description,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            event.imageUrl.isNotEmpty
                ? Image.network(event.imageUrl)
                : Container(),
          ],
        ),
      ),
    );
  }
}
