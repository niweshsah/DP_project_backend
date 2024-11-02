// lib/screens/user_profile_page.dart

import 'package:flutter/material.dart';
import '../models/user.dart'; // Import User model

class UserProfilePage extends StatelessWidget {
  final User user; // Change this to accept a User object

  UserProfilePage({required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${user.username}\'s Profile'),
      ),
      body: Center(
        child: Text('Welcome, ${user.username}!'),
      ),
    );
  }
}
