export const INTENTS = [
  {
    id: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good evening"],
    reply: () =>
      "Hi! I’m ZenBot. How can I assist you today? Feel free to ask about meditation, wellness, or how to manage stress.",
  },
  {
    id: "ask_about_meditation",
    patterns: [
      "can you guide me about meditation",
      "tell me about meditation",
      "what is meditation",
      "how to meditate",
    ],
    reply: () =>
      "Meditation is great for mental well-being. Would you like a meditation recommendation for stress, sleep, or relaxation?",
  },
  {
    id: "ask_about_wellness",
    patterns: [
      "what is wellness",
      "tell me about wellness",
      "how to improve wellness",
      "what does wellness mean",
    ],
    reply: () =>
      "Wellness is a state of being in good health, especially as an actively pursued goal. Would you like tips on how to improve your wellness?",
  },
  {
    id: "ask_about_system",
    patterns: [
      "tell me about your system",
      "what is ZenZone",
      "what do you offer",
      "can you tell me about your platform",
    ],
    reply: () =>
      "ZenZone is an interactive platform focused on meditation, wellness, and mental health. We offer guided meditations, wellness tips, and personalized support to help manage stress and improve mental well-being.",
  },
  {
    id: "recommend_stress_meditation",
    patterns: [
      "recommend meditation for stress",
      "suggest meditation for stress",
      "stress meditation",
      "meditation for stress relief",
    ],
    reply: () =>
      "Oh i am really sorry you are feeling that way.I recommend a **Stress Relief Meditation**. You can find that in calm or anxiety relief mood in meditations",
  },
  {
    id: "recommend_sleep_meditation",
    patterns: [
      "recommend meditation for sleep",
      "suggest meditation for sleep",
      "sleep meditation",
    ],
    reply: () =>
      "I suggest a **Sleep Meditation** to help you relax. Would you like to try a 15-minute guided meditation for sleep?",
  },
  {
    id: "wellness_tips",
    patterns: ["wellnes-tips", "tips"],
    reply: () => {
      return (
        "Here are some wellness tips for a healthy lifestyle:\n\n" +
        "1. Stay hydrated! Drink at least 8 cups of water per day.\n" +
        "2. Exercise regularly — aim for 30 minutes a day.\n" +
        "3. Practice mindfulness or meditation for at least 5–10 minutes each day.\n" +
        "4. Eat a balanced diet with plenty of fruits, vegetables, and whole grains.\n" +
        "5. Ensure you get enough sleep (7–9 hours per night).\n" +
        "6. Avoid smoking and limit alcohol intake.\n" +
        "7. Engage in activities that bring you joy and relaxation.\n\n" +
        "Would you like me to guide you with any specific wellness activities or suggestions?"
      );
    },
  },

  {
    id: "fallback",
    patterns: [".*"],
    reply: () =>
      "Sorry, I didn’t catch that. Could you please rephrase? You can ask me for meditation or exercises.",
  },
  {
    id: "thanks",
    patterns: [
      "thanks",
      "thank you",
      "thank you very much",
      "thanks a lot",
      "appreciate it",
      "cheers",
      "thanks so much",
    ],
    reply: () =>
      "You're very welcome! I'm always here to help. Let me know if you need anything else. 🌿",
  },
  {
    id: "suggest_exercises",
    patterns: [
      "suggest exercises for stress relief",
      "recommend exercises to relieve stress",
      "what exercises help with stress",
      "give me exercises for sleep",
      "suggest exercises to help me sleep better",
      "suggest relaxation exercises",
      "exercises to relax",
    ],
    reply: () =>
      "I can suggest some exercises to help with stress relief, sleep improvement, and relaxation. Would you like to hear some? If yes, I will give you a list of exercises.",
  },
  {
    id: "affirmative_response_exercise",
    patterns: ["yes", "sure", "okay", "go ahead", "sounds good", "please"],
    reply: () =>
      "Great! Here are a few exercises to help with stress relief and relaxation:\n\n" +
      "1. **Deep Breathing Exercise**\n" +
      "2. **Progressive Muscle Relaxation (PMR)**\n" +
      "3. **Gentle Yoga**\n" +
      "4. **Stretching formuscle pain Relief**\n" +
      "5. **Tai Chi for Relaxation**\n\n" +
      "Which one would you like to proceed with?",
  },
  {
    id: "explain_breathing_exercise",
    patterns: [
      "tell me about deep breathing",
      "explain deep breathing",
      "how do I do deep breathing",
    ],
    reply: () =>
      "Here’s how you do the **Deep Breathing Exercise**:\n\n" +
      "1. Sit comfortably in a chair or lie down.\n" +
      "2. Close your eyes and take a deep breath in through your nose for 4 seconds.\n" +
      "3. Hold your breath for 4 seconds.\n" +
      "4. Exhale slowly through your mouth for 6 seconds.\n" +
      "5. Repeat for 5-10 minutes.\n\n" +
      "This exercise helps calm your nervous system and reduce stress. Let me know how you feel after trying it!",
  },
  {
    id: "explain_pmr_exercise",
    patterns: [
      "tell me about progressive muscle relaxation",
      "how do I do progressive muscle relaxation",
      "explain progressive muscle relaxation",
    ],
    reply: () =>
      "Here’s how you do **Progressive Muscle Relaxation (PMR)**:\n\n" +
      "1. Find a quiet space and sit or lie down comfortably.\n" +
      "2. Start with your feet. Tense the muscles in your feet for 5 seconds, then release.\n" +
      "3. Work your way up your body, tensing each muscle group for 5 seconds, then releasing.\n" +
      "4. Move up to your calves, thighs, stomach, chest, hands, arms, shoulders, neck, and face.\n" +
      "5. Focus on the difference between tension and relaxation.\n\n" +
      "This technique helps release tension and promotes relaxation. Try it for 10-15 minutes to feel more relaxed!",
  },
  {
    id: "explain_yoga_exercise",
    patterns: [
      "tell me about gentle yoga",
      "how do I do gentle yoga",
      "explain gentle yoga",
    ],
    reply: () =>
      "Here’s how you do **Gentle Yoga**:\n\n" +
      "1. Find a comfortable space and lay down a yoga mat.\n" +
      "2. Begin with simple stretches such as **Child's Pose** and **Cat-Cow Stretch**.\n" +
      "3. Focus on your breathing as you slowly stretch each body part.\n" +
      "4. Perform stretches like **Seated Forward Bend**, **Downward Dog**, and **Cobra Pose**.\n" +
      "5. Hold each position for 20-30 seconds, focusing on relaxation and mindful breathing.\n\n" +
      "Gentle yoga is perfect for stress relief. You can repeat these poses as long as you'd like. How do you feel after trying it?",
  },
  {
    id: "explain_stretching_exercise",
    patterns: [
      "tell me about stretching for muscle pain relief",
      "how do I stretch to relieve muscle pain",
      "explain stretching for muscle relief",
    ],
    reply: () =>
      "Here’s how you can do **Stretching for Stress Relief**:\n\n" +
      "1. Begin with **Neck Stretches**: Gently tilt your head from side to side.\n" +
      "2. Do **Shoulder Rolls**: Roll your shoulders in a circular motion, both forward and backward.\n" +
      "3. Try **Standing Forward Bend**: Stand with your feet hip-width apart, then slowly bend forward and reach for your toes.\n" +
      "4. Stretch your **Hamstrings**: Sit on the floor and stretch one leg out straight, reaching for your toes.\n" +
      "5. Finish with **Side Stretches**: Reach your right arm overhead, bend your torso to the left, and repeat on the other side.\n\n" +
      "This should help release built-up tension. Repeat each stretch for 30 seconds to 1 minute.",
  },
  {
    id: "explain_tai_chi_exercise",
    patterns: [
      "tai chi",
      "tell me about tai chi",
      "how do I do tai chi for relaxation",
      "explain tai chi for relaxation",
    ],
    reply: () =>
      "Here’s how you can practice **Tai Chi for Relaxation**:\n\n" +
      "1. Start by standing with your feet shoulder-width apart and your arms relaxed.\n" +
      "2. Begin with slow, deliberate movements, focusing on your breath.\n" +
      "3. Move into the **Parting the Wild Horse’s Mane** posture: step to the side, one arm up and one arm down.\n" +
      "4. Transition into **Wave Hands Like Clouds**: slowly shift your weight from side to side, gently waving your hands.\n" +
      "5. Focus on fluidity and control, staying calm and breathing deeply.\n\n" +
      "Tai Chi is perfect for calming the mind and reducing stress. Try practicing for 10-15 minutes and see how you feel.",
  },
];
