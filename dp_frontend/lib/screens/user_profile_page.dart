// lib/screens/user_profile_page.dart

import 'package:flutter/material.dart';
import '../models/user.dart';

class UserProfilePage extends StatelessWidget {
  final User user;

  UserProfilePage({required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Username: ${user.username}', style: TextStyle(fontSize: 18)),
            Text('Email: ${user.email}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 20),
            Text('Registered Events:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Music Concert on 2024-11-15'),
            Text('Art Exhibition on 2024-12-01'),
          ],
        ),
      ),
    );
  }
}
