import 'package:flutter/material.dart';
import 'package:realio/widgets/common_widgets.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final TextEditingController _visualLinkController = TextEditingController();
  bool _isVisualProcessing = false;
  double? _visualDeepfakeScore;
  double? _visualAuthenticityScore;

  final TextEditingController _voiceLinkController = TextEditingController();
  bool _isVoiceProcessing = false;
  double? _voiceDeepfakeScore;
  double? _voiceAuthenticityScore;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _visualLinkController.dispose();
    _voiceLinkController.dispose();
    super.dispose();
  }

  Future<void> _processVisualLink() async {
    if (_visualLinkController.text.isEmpty) return;
    setState(() {
      _isVisualProcessing = true;
      _visualDeepfakeScore = null;
      _visualAuthenticityScore = null;
    });

    await Future.delayed(const Duration(seconds: 3));

    setState(() {
      _isVisualProcessing = false;
      _visualDeepfakeScore = 87.5;
      _visualAuthenticityScore = 12.5;
    });
  }

  Future<void> _processVoiceLink() async {
    if (_voiceLinkController.text.isEmpty) return;
    setState(() {
      _isVoiceProcessing = true;
      _voiceDeepfakeScore = null;
      _voiceAuthenticityScore = null;
    });

    await Future.delayed(const Duration(seconds: 3));

    setState(() {
      _isVoiceProcessing = false;
      _voiceDeepfakeScore = 92.1;
      _voiceAuthenticityScore = 7.9;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Row(
          children: const [
            Icon(Icons.shield_moon_outlined, color: ThemeConstants.gold),
            SizedBox(width: 8),
            Text(
              'Realio Dashboard',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white70),
            onPressed: () {
              Navigator.pushReplacementNamed(context, '/');
            },
          )
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: ThemeConstants.gold,
          indicatorWeight: 3,
          labelColor: ThemeConstants.gold,
          unselectedLabelColor: Colors.white54,
          tabs: const [
            Tab(
              icon: Icon(Icons.video_camera_back),
              text: 'Video & Photos',
            ),
            Tab(
              icon: Icon(Icons.mic),
              text: 'Voice Detection',
            ),
          ],
        ),
      ),
      body: Container(
        decoration: ThemeConstants.gradientBackground(),
        child: SafeArea(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildVisualMediaTab(),
              _buildVoiceDetectionTab(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoreWidget(String label, double score, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.5), width: 1),
      ),
      child: Column(
        children: [
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 14)),
          const SizedBox(height: 8),
          Text('${score.toStringAsFixed(1)}%', style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: score / 100,
            backgroundColor: Colors.white12,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildVisualMediaTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Visual Analysis',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          const Text(
            'Upload file or provide a link for deepfake verification.',
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: SingleChildScrollView(
              child: GlassContainer(
                padding: 16.0,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        shape: BoxShape.circle,
                        border: Border.all(color: ThemeConstants.gold, width: 2),
                      ),
                      child: const Icon(
                        Icons.cloud_upload_outlined,
                        size: 40,
                        color: ThemeConstants.gold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.upload_file),
                      label: const Text('SELECT FILE'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        backgroundColor: ThemeConstants.accentPurple,
                        foregroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Row(
                      children: [
                        Expanded(child: Divider(color: Colors.white30)),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text('OR ENVELOPE A LINK', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ),
                        Expanded(child: Divider(color: Colors.white30)),
                      ],
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _visualLinkController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Enter Video or Image Link (URL)',
                        hintStyle: const TextStyle(color: Colors.white54),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.1),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        prefixIcon: const Icon(Icons.link, color: ThemeConstants.gold),
                      ),
                    ),
                    const SizedBox(height: 24),
                    _isVisualProcessing
                        ? const CircularProgressIndicator(color: ThemeConstants.gold)
                        : ElevatedButton(
                            onPressed: _processVisualLink,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: ThemeConstants.gold,
                              foregroundColor: ThemeConstants.superDarkPurple,
                              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('GENERATE SCORE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                    if (_visualDeepfakeScore != null) ...[
                      const SizedBox(height: 32),
                      _buildScoreWidget('Deepfake Probability', _visualDeepfakeScore!, Colors.redAccent),
                      const SizedBox(height: 16),
                      _buildScoreWidget('Authenticity Score', _visualAuthenticityScore!, Colors.greenAccent),
                    ]
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceDetectionTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Voice Analysis',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          const Text(
            'Upload audio file or provide a link to detect synthetic voice cloning.',
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: SingleChildScrollView(
              child: GlassContainer(
                padding: 16.0,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        shape: BoxShape.circle,
                        border: Border.all(color: ThemeConstants.gold, width: 2),
                      ),
                      child: const Icon(
                        Icons.multitrack_audio,
                        size: 40,
                        color: ThemeConstants.gold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.audio_file),
                      label: const Text('SELECT AUDIO FILE'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        backgroundColor: ThemeConstants.accentPurple,
                        foregroundColor: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Row(
                      children: [
                        Expanded(child: Divider(color: Colors.white30)),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16.0),
                          child: Text('OR ENVELOPE A LINK', style: TextStyle(color: Colors.white70, fontSize: 12)),
                        ),
                        Expanded(child: Divider(color: Colors.white30)),
                      ],
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _voiceLinkController,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Enter Audio Link (URL)',
                        hintStyle: const TextStyle(color: Colors.white54),
                        filled: true,
                        fillColor: Colors.white.withOpacity(0.1),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        prefixIcon: const Icon(Icons.link, color: ThemeConstants.gold),
                      ),
                    ),
                    const SizedBox(height: 24),
                    _isVoiceProcessing
                        ? const CircularProgressIndicator(color: ThemeConstants.gold)
                        : ElevatedButton(
                            onPressed: _processVoiceLink,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: ThemeConstants.gold,
                              foregroundColor: ThemeConstants.superDarkPurple,
                              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: const Text('GENERATE SCORE', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                    if (_voiceDeepfakeScore != null) ...[
                      const SizedBox(height: 32),
                      _buildScoreWidget('Deepfake Probability', _voiceDeepfakeScore!, Colors.redAccent),
                      const SizedBox(height: 16),
                      _buildScoreWidget('Authenticity Score', _voiceAuthenticityScore!, Colors.greenAccent),
                    ]
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
