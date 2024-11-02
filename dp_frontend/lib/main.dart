// lib/main.dart

import 'package:flutter/material.dart';
import 'screens/home_page.dart';
import 'screens/login_page.dart';
import 'screens/registration_page.dart';
import 'screens/user_profile_page.dart';
import 'models/user.dart'; // Import User model
import 'utils/constants.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: Constants.appName,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      initialRoute: '/',
      routes: {
        '/': (context) => LoginPage(),
        '/register': (context) => RegistrationPage(),
      },
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/home':
            return MaterialPageRoute(
              builder: (context) => HomePage(),
            );
          case '/profile':
            final User user = settings.arguments as User; // Retrieve User object
            return MaterialPageRoute(
              builder: (context) => UserProfilePage(user: user), // Pass the user object
            );
          default:
            return null; // Handle other routes if necessary
        }
      },
    );
  }
}
