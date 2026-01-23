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
        "Panche Baja Dance Rhythm",
        "Ghatu Dance Storytelling",
        "Munyali Folk Dance",
        "Chutka Dance Rhythms",
        "Hudke Naach Performance"
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
        "Malshree Dhun Vocals",
        "Deuda Singing Style",
        " Bhajan and Kirtan Basics",
        "Charya Song Melodies",
        "Gaine Traditional Ballads"
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
        "Damaha and Tyauko Beats",
        "Arbajo Ancient Strings",
        "Murchunga Jaw Harp",
        "Sarangi Bowing",
        "Dhangro Shaman Beats"
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
        "Khukuri Forging Art",
        "Paubha Sacred Painting",
        "Clay Mask Making",
        "Nepalese Paper Craft",
        "Traditional Jewelry Casting"
    ]
];

$languages = ["Nepali", "English", "Newari", "Tamang", "Maithali", "Bhojpuri", "Tharu"];
$levels = ["Beginner", "Intermediate", "Advanced"];

$res = $conn->query("SELECT id FROM teacher_courses LIMIT 200");
$count = 0;

while ($row = $res->fetch_assoc()) {
    $id = $row['id'];
    $cat_keys = array_keys($titles);
    $category = $cat_keys[array_rand($cat_keys)];
    $title_list = $titles[$category];
    $course_title = $title_list[array_rand($title_list)] . " (Course ID: " . (rand(1000, 9999)) . ")";

    $lang = $languages[array_rand($languages)];
    $level = $levels[array_rand($levels)];
    $weeks = rand(4, 16);
    $hours = rand(2, 10);

    $desc = "Dive deep into the rich traditions of $course_title. This comprehensive course explores the historical roots and practical techniques of $category within the cultural context of Nepal. Students will gain a profound understanding of the artistic heritage and maintain the legacy of these ancient practices through guided lessons and hands-on experience.";

    $learn = "• Detailed history and evolution of $category in Nepal.\n" .
        "• Master the specific rhythms, scales, or movements of $course_title.\n" .
        "• Understanding the cultural symbolism and spiritual significance.\n" .
        "• Perform or create art using traditional authentic methods.\n" .
        "• Insights into the preservation of indigenous cultural identities.";

    $reqs = "• A keen interest in $category and Nepalese heritage.\n" .
        "• Basic tools or attire relevant to $category (guidance provided).\n" .
        "• Commitment to practice at least $hours hours per week.\n" .
        "• No specific prior knowledge required for $level level.";

    $schedule = "Phase 1: Historical context and cultural introduction.\n" .
        "Phase 2: Fundamental techniques, holding/positioning and basic rhythms.\n" .
        "Phase 3: Intermediate patterns and sequence building.\n" .
        "Phase 4: Advanced performance techniques and cultural nuances.\n" .
        "Final: Mastery demonstration and certificate presentation.";

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

echo "Successfully updated $count courses with randomized English data and language tags.\n";
