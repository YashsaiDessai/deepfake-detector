import 'package:flutter/material.dart';
import 'package:realio/screens/login_screen.dart';
import 'package:realio/screens/signup_screen.dart';
import 'package:realio/screens/home_screen.dart';

void main() {
  runApp(const RealioApp());
}

class RealioApp extends StatelessWidget {
  const RealioApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Realio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF6441A5),
        scaffoldBackgroundColor: const Color(0xFF1E1E1E),
        fontFamily: 'Roboto', // Using default reasonable font
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF6441A5),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white.withOpacity(0.1),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: Color(0xFFFFD700), width: 2), // Gold
          ),
          labelStyle: const TextStyle(color: Colors.white70),
          hintStyle: const TextStyle(color: Colors.white54),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/home': (context) => const HomeScreen(),
      },
      // Error handling for unknown routes
      onUnknownRoute: (settings) {
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      },
    );
  }
}
