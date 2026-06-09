# Tutelage 

Tutelage is a flexible, lightweight training generator designed to bridge the gap between web-native content and traditional Learning Management Systems (LMS). Whether you want to deploy a standalone, beautiful HTML-based class or package your content into a standard SCORM wrapper for LMS tracking, Tutelage handles the heavy lifting.

## Features

* **Self-Contained HTML Classes:** Generate completely portable, single-file or cohesive folder-based HTML training modules that run flawlessly in any modern browser.
* **SCORM Packaging:** Instantly wrap your HTML lessons into SCORM-compliant ZIP files for seamless ingestion, tracking, and completion reporting on any LMS.
* **Developer & Designer Friendly:** Focus on crafting great content and interactive elements without worrying about LMS communication scripts or tedious manifest files.
* **Responsive & Lightweight:** Built to ensure training looks exceptional on desktops, tablets, and mobile devices without heavy framework overhead.

---

## Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### Installation
Clone the repository and install the dependencies:

```bash
git clone [https://github.com/yourusername/tutelage.git](https://github.com/yourusername/tutelage.git)
cd tutelage
npm install

```

### Basic Usage

#### 1. Generate a Standalone HTML Lesson

To compile your source files into a clean, interactive HTML class:

```bash
npm run build -- --target=html --src=./my-lesson

```

#### 2. Generate a SCORM Package

To compile your source files and automatically wrap them for LMS deployment:

```bash
npm run build -- --target=scorm --scorm-version=1.2 --src=./my-lesson

```

*This outputs a deployable `.zip` file ready to upload directly to Moodle, Canvas, Blackboard, or any other major LMS.*

---

## Project Structure

```text
tutelage/
├── src/                # Core generator logic & templates
├── wrappers/           # SCORM 1.2 / 2004 communication wrappers
├── templates/          # Base HTML/CSS layouts for lessons
├── package.json        # Project configuration & scripts
└── README.md

```

## Contributing

Contributions are welcome! If you have ideas for new templates, better SCORM tracking features, or bug fixes, feel free to dive in:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

```
