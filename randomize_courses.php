<?php
include("c:/xampp/htdocs/CultureConnect/backend/config/dbconnect.php");

$titles = [
    "Cultural Dances" => [
        "Maruni Dance Essence",
        "Lakhey Dance Fundamentals",
        "Sakela Celebration Dance",
        "Tamang Selo Basics",
        "Deuda Folklore Technique",
        "Tharu Stick Dance Mastery",
        "Bhojpuri Jhijhiya Steps",
        "Traditional Newari Dhime Dance",
        "Maithili Jhijhiya Dance",
        "Kaura Dance of Magar Community",
        "Sorathi Folk Dance",
        "Chandi Naach traditions",
        "Bajrayogini Dance Steps",
        "Manjushree Charya Nritya",
        "Khukuri Naach Energy",
        "Panche Baja Dance Rhythm"
    ],
    "Cultural Singing" => [
        "Classical Maithili Geets",
        "Newari Rajmati Melodies",
        "Tamang Selo Vocal Training",
        "Bhojpuri Biraha Songs",
        "Nepali Dohori Techniques",
        "Tharu Folk Harmonies",
        "Maithili Sohar Traditions",
        "Modern Adaptation of Folk Songs",
        "Rodi Ghar Melodies",
        "Panche Baja Vocal Accompaniment",
        "Asare Pandhra Songs",
        "Malshree Dhun Vocals"
    ],
    "Musical Instruments" => [
        "Dhime Drumming Mastery",
        "Madal Rhythm Fundamentals",
        "Sarangi Melodic Soul",
        "Bansuri Flute Techniques",
        "Pancha Baja Ensemble",
        "Tungna Strings of Himalayas",
        "Dholak Bhojpuri Style",
        "Harmonium for Folk Music",
        "Khyali and Jhyali Rhythms",
        "Sahanai Sacred Sound",
        "Ektare Devotional String",
        "Damaha and Tyauko Beats"
    ],
    "Cultural Art & Crafts" => [
        "Mithila Art Painting",
        "Thangka Illustration Basics",
        "Traditional Pottery Techniques",
        "Newari Wood Carving",
        "Nepali Dhaka Weaving",
        "Maithili Kohbar Art",
        "Bamboo Craft Creation",
        "Metal Casting Traditions",
        "Stupa Architecture Drawing",
        "Traditional Ornament Design",
        "Dhaka Topi Stitching",
        "Khukuri Forging Art"
    ]
];

$languages = ["Nepali", "English", "Newari", "Tamang", "Maithali", "Bhojpuri", "Tharu"];
$levels = ["Beginner", "Intermediate", "Advanced"];

function generatePoints($prefix, $lang)
{
    $points = [];
    $num = rand(3, 5);
    for ($i = 1; $i <= $num; $i++) {
        $points[] = "• $prefix point $i in $lang culture context.";
    }
    return implode("\n", $points);
}

// More specific translations or phrases for each language to make it look "real"
$cultural_descriptions = [
    "Nepali" => "हाम्रो प्राचीन संस्कृति र परम्परालाई जगेर्ना गर्ने एउटा अनुपम प्रयास।",
    "Newari" => "झिगु संस्कृतिया बांलागु लुमन्ति र परम्परायात ल्यंका तयेगु कुतः।",
    "Maithali" => "हमर सभक मिथिला संस्कृति आ परम्पराके आगा बढ़ाबय लेल एकटा प्रयास।",
    "English" => "A unique journey into the heart of our ancient traditions and cultural heritage.",
    "Bhojpuri" => "अपना संस्कृति अउर परंपरा के बचावे खातिर एगो छोट प्रयास।",
    "Tamang" => "यम्बुला तामाङ ग्योइ र मौलिक संस्कृतिलाई जोगाउने कोसिस।",
    "Tharu" => "हमर थारु संस्कृति अउर पहिचान के संरक्षण करेक प्रयास।"
];

$res = $conn->query("SELECT id FROM teacher_courses LIMIT 200");
$count = 0;

while ($row = $res->fetch_assoc()) {
    $id = $row['id'];
    $cat_keys = array_keys($titles);
    $category = $cat_keys[array_rand($cat_keys)];
    $title_list = $titles[$category];
    $course_title = $title_list[array_rand($title_list)] . " - " . (rand(100, 999));

    $lang = $languages[array_rand($languages)];
    $level = $levels[array_rand($levels)];
    $weeks = rand(4, 12);
    $hours = rand(2, 6);

    $desc = $cultural_descriptions[$lang] . " This course covers the deep roots of $course_title. " .
        "तपाईंले यस कोर्समा धेरै कुरा सिक्न सक्नुहुनेछ। Explore the depths of $category.";

    $learn = "• Understanding the history of $category in $lang community.\n" .
        "• Mastering the primary movements/rhythms of $course_title.\n" .
        "• Cultural significance and storytelling through art.\n" .
        "• Connecting with local ethnic traditions.";

    $reqs = "• Basic interest in $lang culture.\n" .
        "• No prior experience needed for Beginner level.\n" .
        "• Enthusiastic learning mindset.\n" .
        "• Proper cultural attire (recommended).";

    $schedule = "Week 1: Introduction to history of $course_title.\n" .
        "Week 2: Fundamental techniques and terminology.\n" .
        "Week 3-4: Practical sessions and rhythm synchronization.\n" .
        "Week 5+: Advanced forms and final performance.";

    $stmt = $conn->prepare("UPDATE teacher_courses SET 
        course_title = ?, 
        category = ?, 
        skill_level = ?, 
        duration_weeks = ?, 
        hours_per_week = ?, 
        description = ?, 
        what_you_will_learn = ?, 
        requirements = ?, 
        learning_schedule = ?, 
        language = ? 
        WHERE id = ?");

    $stmt->bind_param(
        "sssiisssssi",
        $course_title,
        $category,
        $level,
        $weeks,
        $hours,
        $desc,
        $learn,
        $reqs,
        $schedule,
        $lang,
        $id
    );

    $stmt->execute();
    $count++;
}

echo "Successfully updated $count courses with random cultural data.\n";
