<h1>💌 Love Letter</h1>

<strong>A personalized, interactive digital love letter experience built with React.</strong>

Love Letter is a client-side web application that lets users create and share personalized digital love letters through two different experiences: a <strong>Static Card</strong> for a focused, straightforward message and a <strong>Story Card</strong> for a deeper, interactive storytelling experience.

The project was designed to be more than a static form: it combines interactive storytelling, client-side data handling, accessibility, responsive design, validation, and thoughtful user experience into a single application.

<h2>💌 Two Card Experiences</h2>

Love Letter provides two different ways to create and share a personalized message.

<h3>💗 Static Card</h3>

The Static Card is designed around the core love-letter experience. It keeps the creation process focused on the essential information needed to deliver a personalized message.

<strong>Users provide:</strong>
<ul>
  <li>Recipient</li>
  <li>Message</li>
  <li>Sender</li>
  <li>Passcode</li>
  <li>Expiration period</li>
  <li>Envelope color</li>
  <li>Sparkle animation</li>
</ul>

The recipient can then open the generated link, verify the card, enter the passcode, and interact with the envelope to reveal the message.

The Static Card is intentionally simple and focused on the message itself.

<h3>💕 Story Card</h3>

The Story Card builds on the Static Card foundation while collecting significantly more personalized information to create a deeper storytelling experience.

In addition to all of the Static Card fields, users can provide:

<strong>Favorite Memories</strong>

<ul>
  <li>Memory description</li>
  <li>Date</li>
  <li>Location</li>
  <li>Optional image</li>
  <li>Multiple memories</li>
</ul>

<strong>How You Make Me Feel</strong>

<ul>
  <li>The way you...</li>
  <li>Makes me feel...</li>
</ul>

<strong>Favorite Things About You</strong>

<ul>
  <li>Favorite thing you do</li>
  <li>Favorite physical feature</li>
  <li>Favorite thing you say</li>
  <li>Favorite thing you do together</li>
</ul>

<strong>Things I Don't Say Enough</strong>

<ul>
  <li>Multiple personalized entries</li>
</ul>

This additional content gives the Story Card enough information to evolve beyond a single message into a personalized, scene-based experience.

<h3>Static Card vs. Story Card</h3>

<table>
  <thead>
    <tr>
      <th scope="col">Feature</th>
      <th scope="col">💗 Static Card</th>
      <th scope="col">💕 Story Card</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Recipient & Sender</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Main Message</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Passcode Protection</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Expiration</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Custom Envelope Color</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Sparkle Animation</td>
      <td>✓</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Favorite Memories</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Memory Dates</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Memory Locations</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Memory Images</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Personal Feelings</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Favorite Things</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Multiple "Don't Say Enough" Entries</td>
      <td>—</td>
      <td>✓</td>
    </tr>
    <tr>
      <td>Scene-Based Presentation</td>
      <td>—</td>
      <td>✓</td>
    </tr>
  </tbody>
</table>

The two experiences share the same core principles around <strong>validation, accessibility, responsive design, expiration handling, and personalized presentation</strong>, while the Story Card extends those foundations with significantly more user-generated content and interactive storytelling.

<h2>🔐 Private, Shareable Links</h2>

Each generated letter is converted into encoded data and included in a shareable URL.

<strong>The recipient can:</strong>

<ul>
  <li>Open the generated link</li>
  <li>Pass URL and data validation</li>
  <li>Decode and validate the card data</li>
  <li>Verify that the letter has not expired</li>
  <li>Enter the required passcode</li>
  <li>Unlock the card</li>
  <li>Experience the appropriate card presentation</li>
</ul>

<strong>Security note</strong>: Love Letter's client-side encoding is intended for privacy and obscurity, not cryptographic security. Sensitive information should not be treated as secure because the encoded data can ultimately be decoded by the client.

<h2>⏳ Expiring Letters</h2>

Creators can choose an expiration period for their letter.

<strong>The application:</strong>

<ul>
  <li>Stores an expiration timestamp with the card</li>
  <li>Checks expiration when the link is opened</li>
  <li>Displays a live expiration countdown</li>
  <li>Prevents access after expiration</li>
  <li>Provides an accessible expiration announcement for screen-reader users</li>
</ul>

Expired cards are handled as a dedicated user-facing state rather than allowing expired content to remain accessible.

<h2>📖 Interactive Storytelling</h2>

Story Cards use a <strong>scene-based storytelling structure</strong>.

The story viewer uses reusable scene components that can be dynamically rendered based on the current scene:

```javascript
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
```

This structure allows additional scenes to be added without rewriting the overall story viewer.

As the Story Card grows, individual scenes can remain independent while sharing the same underlying card data.

<h2>♿ Accessibility</h2>

Accessibility has been considered throughout the application rather than added as a final step.

<strong>Current Accessibility Work</strong>

<ul>
  <li>Semantic headings and HTML elements</li>
  <li>Proper form labels</li>
  <li>Keyboard-accessible controls</li>
  <li>Keyboard submission for passcode forms</li>
  <li>Accessible password visibility controls</li>
  <li>aria-expanded for interactive content</li>
  <li>aria-invalid and aria-describedby for validation errors</li>
  <li>Screen-reader announcements for important status changes</li>
  <li>Decorative emoji and graphics hidden from assistive technology</li>
  <li>Decorative animation hidden from screen readers</li>
  <li>Accessible navigation labels</li>
  <li>Disabled navigation controls when appropriate</li>
  <li>Focus management for confirmation modals</li>
  <li>Keyboard focus trapping inside modals</li>
  <li>Escape-key support for closing modals</li>
  <li>Focus restoration after modal interaction</li>
  <li>Reduced-motion considerations</li>
</ul>

The goal is for the experience to remain understandable and usable without relying solely on visual animation.

<h2>📱 Responsive Design</h2>

The interface is designed to work across different screen sizes, from mobile devices to large desktop displays.

<strong>Responsive considerations include:</strong>

<ul>
  <li>Flexible layouts</li>
  <li>Mobile-friendly form controls</li>
  <li>Responsive typography</li>
  <li>Scalable interactive elements</li>
  <li>Touch-friendly buttons</li>
  <li>Content that remains usable at larger viewport sizes</li>
</ul>

<h2>🛠️ Technology</h2>

<table>
  <thead>
    <tr>
      <th scope="col">Technology</th>
      <th scope="col">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">React</th>
      <td>Component-based UI and application state</td>
    </tr>
    <tr>
      <th scope="row">JavaScript</th>
      <td>Application logic and data handling</td>
    </tr>
    <tr>
      <th scope="row">CSS</th>
      <td>Responsive styling, animations, and visual design</td>
    </tr>
    <tr>
      <th scope="row">Vite</th>
      <td>Development and production tooling</td>
    </tr>
    <tr>
      <th scope="row">Font Awesome</th>
      <td>Interface icons</td>
    </tr>
    <tr>
      <th scope="row">Git / GitHub</th>
      <td>Version control and project development</td>
    </tr>
  </tbody>
</table>

<h2>🧩 Application Structure</h2>

Love Letter is organized around reusable React components and separated responsibilities.

<strong>Simplified Structure</strong>

```text
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
```

<strong>The application separates</strong>:

<ul>
  <li>Card creation</li>
  <li>Form validation</li>
  <li>Dynamic form state</li>
  <li>Data encoding/decoding</li>
  <li>URL verification</li>
  <li>Expiration handling</li>
  <li>Passcode verification</li>
  <li>Story presentation</li>
  <li>Individual story scenes</li>
  <li>Reusable visual components</li>
  <li>Accessibility behavior</li>
</ul>

This makes the project easier to extend as additional story scenes and functionality are introduced.

<h2>🔄 User Flow</h2>

<h3>Static Card</h3>

```text
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
```

<h3>Story Card</h3>

```text
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
```

<h2>🧠 Engineering Highlights</h2>

<h3>Form Validation</h3>

The creation experience validates required fields before generating a card.

<strong>Validation includes:</strong>

<ul>
  <li>Required field checks</li>
  <li>Whitespace trimming</li>
  <li>Passcode length requirements</li>
  <li>Expiration option validation</li>
  <li>Memory validation</li>
  <li>Dynamic prompt validation</li>
  <li>User-friendly error messaging</li>
</ul>

The application also tracks unsaved changes so users are warned before navigating away from unfinished work.

<h3>Dynamic Form State</h3>

Related data is maintained within structured state objects and arrays.

For example, Story Card memories are managed dynamically:

``` javascript
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
```

Users can add and remove memories while maintaining a consistent form structure.

The same approach is used for other dynamic Story Card sections, such as <strong>"Things I Don't Say Enough."</strong>

<h3>Reusable Components</h3>

Interactive elements such as:

<ul>
  <li>Story scenes</li>
  <li>Sparkle animations</li>
  <li>Form controls</li>
  <li>Password visibility controls</li>
  <li>Modal interactions</li>
</ul>

are designed to be reusable rather than tightly coupled to a single page.

The Story Card's scene architecture also allows new experiences to be added without rebuilding the entire viewer.

<h3>Error Handling</h3>

The application handles malformed or incomplete links without crashing the interface.

Decoding and validation occur inside guarded logic so invalid data can be presented as a user-friendly error state.

The viewer distinguishes between different failure states, including:

<ul>
  <li>Invalid URLs</li>
  <li>Malformed card data</li>
  <li>Invalid card fields</li>
  <li>Expired cards</li>
  <li>Incorrect passcodes</li>
</ul>

<h2>🔒 Security Considerations</h2>

Love Letter intentionally uses <strong>client-side encoded data</strong> rather than claiming that the URL provides true encryption.

The application validates decoded data before using it, including:

<ul>
  <li>Expected data types</li>
  <li>Required fields</li>
  <li>Valid expiration timestamps</li>
  <li>URL structure</li>
  <li>Passcode verification</li>
</ul>

However, because the data is ultimately stored in the URL and processed client-side, this approach should <strong>not</strong> be used for sensitive or confidential information.

The passcode provides an additional access barrier within the application's experience, but it should <strong>not be considered equivalent to server-side authentication or cryptographic protection</strong>.

<h2>🎯 What This Project Demonstrates</h2>

Love Letter was built to practice and demonstrate practical front-end development skills, including:

<ul>
  <li>React component architecture</li>
  <li>State management</li>
  <li>Dynamic forms</li>
  <li>Client-side data validation</li>
  <li>Data encoding and decoding</li>
  <li>URL validation</li>
  <li>Conditional rendering</li>
  <li>Reusable components</li>
  <li>Interactive UI design</li>
  <li>Responsive CSS</li>
  <li>Accessibility-focused development</li>
  <li>Keyboard navigation</li>
  <li>Focus management</li>
  <li>Error handling</li>
  <li>User experience design</li>
  <li>Git-based development</li>
</ul>

The project also reflects an emphasis on building for <strong>real users rather than only making an interface visually appealing</strong>—particularly through accessibility, responsive behavior, validation, and clear interaction states.

<h2>👩‍💻 Project</h2>

Love Letter is a personal portfolio project developed to explore the intersection of <strong>React development, interactive storytelling, accessibility, and user experience design</strong>.

The project demonstrates how a common concept—a digital love letter—can be developed into <strong>two distinct user experiences</strong> while sharing a common foundation of reusable components, structured data, validation, accessibility, and responsive design.

<strong>Built with curiosity, iteration, and a lot of 💌</strong
