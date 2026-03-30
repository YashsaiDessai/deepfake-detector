import 'package:flutter/material.dart';

class ThemeConstants {
  static const Color superDarkPurple = Color(0xFF0D0221);
  static const Color deepPurple = Color(0xFF260F42);
  static const Color accentPurple = Color(0xFF4A148C);
  static const Color gold = Color(0xFFFFD700);

  static BoxDecoration gradientBackground() {
    return const BoxDecoration(
      gradient: LinearGradient(
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
        colors: [
          superDarkPurple,
          deepPurple,
          accentPurple,
        ],
      ),
    );
  }
}

class GlassContainer extends StatelessWidget {
  final Widget child;
  final double padding;

  const GlassContainer({Key? key, required this.child, this.padding = 32.0}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(padding),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 5,
          ),
        ],
      ),
      child: child,
    );
  }
}
