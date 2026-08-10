💌 Love Letter

A personalized, interactive digital love letter experience built with React.

Love Letter is a client-side web application that lets users create and share personalized digital love letters through two different experiences: a Static Card for a focused, straightforward message and a Story Card for a deeper, interactive storytelling experience.

The project was designed to be more than a static form: it combines interactive storytelling, client-side data handling, accessibility, responsive design, validation, and thoughtful user experience into a single application.

💌 Two Card Experiences

Love Letter provides two different ways to create and share a personalized message.

💗 Static Card

The Static Card is designed around the core love-letter experience. It keeps the creation process focused on the essential information needed to deliver a personalized message.

Users provide:

Recipient
Message
Sender
Passcode
Expiration period
Envelope color
Sparkle animation

The recipient can then open the generated link, verify the card, enter the passcode, and interact with the envelope to reveal the message.

The Static Card is intentionally simple and focused on the message itself.

💕 Story Card

The Story Card builds on the Static Card foundation while collecting significantly more personalized information to create a deeper storytelling experience.

In addition to all of the Static Card fields, users can provide:

Favorite Memories

Memory description
Date
Location
Optional image
Multiple memories

How You Make Me Feel

The way you...
Makes me feel...

Favorite Things About You

Favorite thing you do
Favorite physical feature
Favorite thing you say
Favorite thing you do together

Things I Don't Say Enough

Multiple personalized entries

This additional content gives the Story Card enough information to evolve beyond a single message into a personalized, scene-based experience.

Static Card vs. Story Card
Feature	💗 Static Card	💕 Story Card
Recipient & Sender	✓	✓
Main Message	✓	✓
Passcode Protection	✓	✓
Expiration	✓	✓
Custom Envelope Color	✓	✓
Sparkle Animation	✓	✓
Favorite Memories	—	✓
Memory Dates	—	✓
Memory Locations	—	✓
Memory Images	—	✓
Personal Feelings	—	✓
Favorite Things	—	✓
Relationship Details	—	✓
Multiple "Don't Say Enough" Entries	—	✓
Scene-Based Presentation	—	✓

The two experiences share the same core principles around validation, accessibility, responsive design, expiration handling, and personalized presentation, while the Story Card extends those foundations with significantly more user-generated content and interactive storytelling.

✨ Features
💌 Personalized Love Letters

Users can create customized letters with:

Recipient and sender names
Personalized message
Passcode protection
Configurable expiration time
Custom envelope colors
Animated sparkle effects

Story Cards additionally support:

Favorite memories
Memory dates and locations
Optional memory images
Personalized feelings
Favorite things about the recipient
Favorite things they do together
"Things I Don't Say Enough" prompts
Multiple entries for dynamic sections
🔐 Private, Shareable Links

Each generated letter is converted into encoded data and included in a shareable URL.

The recipient can:

Open the generated link
Pass URL and data validation
Decode and validate the card data
Verify that the letter has not expired
Enter the required passcode
Unlock the card
Experience the appropriate card presentation

Security note: Love Letter's client-side encoding is intended for privacy and obscurity, not cryptographic security. Sensitive information should not be treated as secure because the encoded data can ultimately be decoded by the client.

⏳ Expiring Letters

Creators can choose an expiration period for their letter.

The application:

Stores an expiration timestamp with the card
Checks expiration when the link is opened
Displays a live expiration countdown
Prevents access after expiration
Provides an accessible expiration announcement for screen-reader users

Expired cards are handled as a dedicated user-facing state rather than allowing expired content to remain accessible.

📖 Interactive Storytelling

Story Cards use a scene-based storytelling structure.

The story viewer uses reusable scene components that can be dynamically rendered based on the current scene:

const storyScenes = [
  {
    id: "intro",
    component: Intro,
    props: {
      to: card.to,
      from: card.from,
      message: card.message,
      sparkle: card.sparkle,
      color: card.color
    }
  }
];

This structure allows additional scenes to be added without rewriting the overall story viewer.

As the Story Card grows, individual scenes can remain independent while sharing the same underlying card data.

♿ Accessibility

Accessibility has been considered throughout the application rather than added as a final step.

Current accessibility work includes:

Semantic headings and HTML elements
Proper form labels
Keyboard-accessible controls
Keyboard submission for passcode forms
Accessible password visibility controls
aria-expanded for interactive content
aria-invalid and aria-describedby for validation errors
Screen-reader announcements for important status changes
Decorative emoji and graphics hidden from assistive technology
Decorative animation hidden from screen readers
Accessible navigation labels
Disabled navigation controls when appropriate
Focus management for confirmation modals
Keyboard focus trapping inside modals
Escape-key support for closing modals
Focus restoration after modal interaction
Reduced-motion considerations

The goal is for the experience to remain understandable and usable without relying solely on visual animation.

📱 Responsive Design

The interface is designed to work across different screen sizes, from mobile devices to large desktop displays.

Responsive considerations include:

Flexible layouts
Mobile-friendly form controls
Responsive typography
Scalable interactive elements
Touch-friendly buttons
Content that remains usable at larger viewport sizes
🛠️ Technology
Technology	Purpose
React	Component-based UI and application state
JavaScript	Application logic and data handling
CSS	Responsive styling, animations, and visual design
Vite	Development and production tooling
Font Awesome	Interface icons
Git / GitHub	Version control and project development
🧩 Application Structure

Love Letter is organized around reusable React components and separated responsibilities.

A simplified structure looks like:

src/
├── components/
│   ├── CreateStory
│   ├── ViewStory
│   └── ...
│
├── storyScenes/
│   ├── IntroScene
│   └── ...
│
├── utils/
│   └── encode.js
│
└── ...

The application separates:

Card creation
Form validation
Dynamic form state
Data encoding/decoding
URL verification
Expiration handling
Passcode verification
Story presentation
Individual story scenes
Reusable visual components
Accessibility behavior

This makes the project easier to extend as additional story scenes and functionality are introduced.

🔄 User Flow
Static Card
Create Static Card
        │
        ▼
Validate Form
        │
        ▼
Generate Expiration Timestamp
        │
        ▼
Build Card Payload
        │
        ▼
Encode Data
        │
        ▼
Generate Shareable URL
        │
        ▼
       Share
        │
        ▼
Recipient Opens Link
        │
        ▼
Validate URL + Decode Data
        │
        ├── Invalid ──────► Invalid Link
        │
        ├── Expired ──────► Expired Message
        │
        ▼
Passcode Verification
        │
        ├── Incorrect ────► Error + Retry
        │
        ▼
Interactive Envelope
        │
        ▼
Reveal Message
Story Card
Create Story Card
        │
        ▼
Validate Form
        │
        ▼
Collect Personalized Content
        │
        ▼
Generate Expiration Timestamp
        │
        ▼
Build Story Payload
        │
        ▼
Encode Data
        │
        ▼
Generate Shareable URL
        │
        ▼
       Share
        │
        ▼
Recipient Opens Link
        │
        ▼
Validate URL + Decode Data
        │
        ├── Invalid ──────► Invalid Link
        │
        ├── Expired ──────► Expired Message
        │
        ▼
Passcode Verification
        │
        ├── Incorrect ────► Error + Retry
        │
        ▼
Story Introduction
        │
        ▼
Interactive Story Scenes
        │
        ▼
Personalized Content
🧠 Engineering Highlights
Form Validation

The creation experience validates required fields before generating a card.

Validation includes:

Required field checks
Whitespace trimming
Passcode length requirements
Expiration option validation
Memory validation
Dynamic prompt validation
User-friendly error messaging

The application also tracks unsaved changes so users are warned before navigating away from unfinished work.

Dynamic Form State

Related data is maintained within structured state objects and arrays.

For example, Story Card memories are managed dynamically:

{
  memories: [
    {
      description: "",
      date: "",
      location: "",
      image: null
    }
  ]
}

Users can add and remove memories while maintaining a consistent form structure.

The same approach is used for other dynamic Story Card sections, such as "Things I Don't Say Enough."

Reusable Components

Interactive elements such as:

Story scenes
Sparkle animations
Form controls
Password visibility controls
Modal interactions

are designed to be reusable rather than tightly coupled to a single page.

The Story Card's scene architecture also allows new experiences to be added without rebuilding the entire viewer.

Error Handling

The application handles malformed or incomplete links without crashing the interface.

Decoding and validation occur inside guarded logic so invalid data can be presented as a user-friendly error state.

The viewer distinguishes between different failure states, including:

Invalid URLs
Malformed card data
Invalid card fields
Expired cards
Incorrect passcodes
🔒 Security Considerations

Love Letter intentionally uses client-side encoded data rather than claiming that the URL provides true encryption.

The application validates decoded data before using it, including:

Expected data types
Required fields
Valid expiration timestamps
URL structure
Passcode verification

However, because the data is ultimately stored in the URL and processed client-side, this approach should not be used for sensitive or confidential information.

The passcode provides an additional access barrier within the application's experience, but it should not be considered equivalent to server-side authentication or cryptographic protection.

♿ Accessibility Philosophy

One of the goals of Love Letter is to demonstrate that an animated and visually expressive application can still provide an accessible experience.

For example, continuously changing visual information such as the expiration countdown is hidden from screen readers while a concise human-readable announcement communicates the relevant information.

Likewise, decorative animations and imagery are separated from meaningful content so assistive technology users aren't forced to interpret purely visual effects.

Accessibility considerations are incorporated while features are being developed rather than treated solely as a final testing step.

🎯 What This Project Demonstrates

Love Letter was built to practice and demonstrate practical front-end development skills, including:

React component architecture
State management
Dynamic forms
Client-side data validation
Data encoding and decoding
URL validation
Conditional rendering
Reusable components
Interactive UI design
Responsive CSS
Accessibility-focused development
Keyboard navigation
Focus management
Error handling
User experience design
Git-based development

The project also reflects an emphasis on building for real users rather than only making an interface visually appealing—particularly through accessibility, responsive behavior, validation, and clear interaction states.

👩‍💻 Project

Love Letter is a personal portfolio project developed to explore the intersection of React development, interactive storytelling, accessibility, and user experience design.

The project demonstrates how a common concept—a digital love letter—can be developed into two distinct user experiences while sharing a common foundation of reusable components, structured data, validation, accessibility, and responsive design.

Built with curiosity, iteration, and a lot of 💌.
