import { useState, useEffect } from "react";

// Static Nepal address data with ward counts
const nepalAddressData = {
  "Koshi": {
    "Bhojpur": {
      "Bhojpur": 11, "Shadanand": 14, "Hatuwagadhi": 11, "Ramprasad Rai": 7, 
      "Aamchok": 9, "Tyamke Maiyunm": 8, "Arun": 10, "Pauwadungma": 9, "Salpasilichho": 9
    },
    "Dhankuta": {
      "Dhankuta": 10, "Pakhribas": 11, "Mahalaxmi": 14, "Sangurigadhi": 12, 
      "Khalsa Chhintang Sahidbhumi": 7, "Chhathar Jorpati": 9, "Chaubise": 9
    },
    "Ilam": {
      "Ilam": 12, "Deumai": 11, "Mai": 10, "Suryodaya": 14, "Phakphokthum": 9, 
      "Mai Jogmai": 8, "Chulachuli": 12, "Rong": 7, "Mangsebung": 9, "Sandakpur": 6
    },
    "Jhapa": {
      "Mechinagar": 15, "Damak": 10, "Kankai": 14, "Bhadrapur": 10, "Arjundhara": 13, 
      "Shivasatakshi": 14, "Gauradaha": 13, "Birtamod": 12, "Kamal": 8, "Gaur": 8, 
      "Barhadashi": 8, "Jhapa": 7, "Buddhashanti": 9, "Haldibari": 7, "Kachankawal": 10
    },
    "Khotang": {
      "Katari": 11, "Chaudandigadhi": 14, "Triyuga": 13, "Belaka": 11, 
      "Udayapurgadhi": 7, "Tapli": 6, "Rautamai": 10, "Limchungbung": 5, "Ranitar": 5
    },
    "Morang": {
      "Biratnagar": 19, "Belbariya": 10, "Letang": 8, "Pathari-Sanischare": 9, 
      "Rangeli": 9, "Ratuwamai": 13, "Sunwarshi": 14, "Urlabari": 14, 
      "Sundarharaicha": 14, "Budi Ganga": 6, "Dhanpalthan": 7, "Gramthan": 7, 
      "Jahada": 9, "Kanepokhari": 9, "Katahari": 9, "Kerabari": 9, "Miklajung": 8
    },
    "Okhaldhunga": {
      "Siddhicharan": 14, "Khijidemba": 9, "Champadevi": 11, "Chisankhugadhi": 11, 
      "Manebhanjyang": 9, "Molung": 10, "Likhu": 8, "Sunkoshi": 11
    },
    "Panchthar": {
      "Phidim": 12, "Hilihang": 10, "Kummayak": 9, "Miklajung": 7, 
      "Phalelung": 9, "Phalgunanda": 9, "Tumbewa": 8, "Yangwarak": 9
    },
    "Sankhuwasabha": {
      "Chainpur": 14, "Dharmadevi": 11, "Khandbari": 13, "Madi": 13, 
      "Panchkhapan": 13, "Bhotkhola": 5, "Chichila": 7, "Makalu": 9, 
      "Sabhapokhari": 9, "Silichong": 8
    },
    "Solukhumbu": {
      "Solududhkunda": 9, "Dudhakaushika": 9, "Dudhkoshi": 9, "Nechasalyan": 9, 
      "Mahakulung": 9, "Sotang": 5, "Likhu Pike": 5, "Khumbu Pasanglhamu": 5
    },
    "Sunsari": {
      "Itahari": 23, "Dharan": 20, "Inaruwa": 14, "Duhabi": 13, "Ramdhuni": 12, 
      "Barahachhetra": 9, "Dewanganj": 10, "Koshi": 14, "Gadhi": 7, "Barju": 7, 
      "Bhokraha Narsingh": 8, "Harinagara": 9
    },
    "Taplejung": {
      "Phungling": 10, "Aathrai Tribeni": 7, "Sidingba": 8, "Phaktanglung": 11, 
      "Mikwakhola": 7, "Meringden": 9, "Maiwakhola": 5, "Pathibhara Yangwarak": 9, 
      "Sirijangha": 7
    },
    "Terhathum": {
      "Myanglung": 12, "Laligurans": 9, "Aathrai": 9, "Chhathar": 11, 
      "Phedap": 8, "Menchhayayem": 10
    },
    "Udayapur": {
      "Katari": 14, "Chaudandigadhi": 14, "Triyuga": 16, "Belaka": 13, 
      "Udayapurgadhi": 14, "Tapli": 7, "Rautamai": 11, "Limchungbung": 8
    }
  },
  "Madhesh": {
    "Parsa": {
      "Birgunj": 32, "Bahudarmai": 11, "Parsagadhi": 9, "Pokhariya": 15, 
      "Bindabasini": 7, "Dhobini": 7, "Chhipaharmai": 9, "Jagarnathpur": 10, 
      "Jirabhawani": 9, "Kalikamai": 11, "Pakahamainpur": 9, "Paterwa Sugauli": 9, 
      "Sakhuwa Prasauni": 9, "Thori": 9
    },
    "Bara": {
      "Kalaiya": 28, "Jeetpur Simara": 21, "Kolhabi": 14, "Nijgadh": 16, 
      "Mahagadhimai": 13, "Simraungadh": 16, "Pacharauta": 9, "Adarsh Kotwal": 7, 
      "Baragadhi": 9, "Devtal": 9, "Karaiyamai": 10, "Parwanipur": 11, 
      "Pheta": 9, "Prasauni": 8, "Suwarna": 9
    },
    "Rautahat": {
      "Baudhimai": 13, "Brindaban": 11, "Chandrapur": 14, "Dewahi Gonahi": 12, 
      "Durga Bhagwati": 11, "Gadhimai": 12, "Garuda": 13, "Gaur": 13, 
      "Gujara": 10, "Ishnath": 13, "Katahariya": 11, "Madhav Narayan": 9, 
      "Maulapur": 12, "Paroha": 11, "Phatuwa Bijayapur": 9, "Rajdevi": 12, 
      "Rajpur": 9, "Yamunamai": 11
    },
    "Sarlahi": {
      "Ishworpur": 19, "Malangawa": 16, "Lalbandi": 16, "Haripur": 11, 
      "Haripurwa": 11, "Hariwan": 16, "Barahathawa": 10, "Balara": 9, 
      "Godaita": 10, "Bagmati": 11, "Kabilasi": 9, "Kaudena": 9, "Parsa": 9, 
      "Basbariya": 9, "Bishnu": 9, "Bramhapuri": 9, "Chakraghatta": 6, 
      "Chandranagar": 8, "Dhankaul": 7, "Ramnagar": 7
    },
    "Dhanusha": {
      "Janakpur": 25, "Chhireshwarnath": 19, "Ganeshman Charnath": 11, 
      "Dhanushadham": 11, "Nagarain": 11, "Bideha": 9, "Mithila": 14, 
      "Sahidnagar": 11, "Sabaila": 14, "Kamala": 16, "Mithila Bihari": 14, 
      "Hansapur": 11, "Janaknandani": 11, "Bateshwar": 9, 
      "Mukhiyapatti Musaharmiya": 9, "Lakshminya": 7, "Aurahi": 9, "Dhanauji": 7
    },
    "Mahottari": {
      "Jaleshwar": 27, "Bardibas": 22, "Gaushala": 22, "Loharpatti": 11, 
      "Ramgopalpur": 11, "Manara Shiswa": 13, "Matihani": 19, "Bhangaha": 11, 
      "Balawa": 14, "Aaurahi": 9, "Ekdanra": 9, "Sonama": 9, "Samsi": 9, 
      "Mahottari": 9, "Pipra": 9
    },
    "Saptari": {
      "Rajbiraj": 20, "Kanchanrup": 11, "Dakneshwori": 19, "Bodebarsain": 19, 
      "Hanumannagar Kankalini": 14, "Khadak": 11, "Sambhunath": 11, 
      "Saptakoshi": 14, "Surunga": 12, "Rajgadh": 9, "Bishnupur": 9, 
      "Balan-Bihul": 9, "Tirhut": 9, "Tilathi Koiladi": 9, "Tilathrautahat": 9, 
      "Mahadeva": 7, "Agnisair Krishna Savaran": 9, "Chhinmasta": 9, "Rupani": 9
    },
    "Siraha": {
      "Lahan": 16, "Dhangadhimai": 19, "Siraha": 20, "Golbazar": 14, 
      "Mirchaiya": 16, "Kalyanpur": 19, "Karjanha": 11, "Sukhipur": 14, 
      "Bhagwanpur": 9, "Aurahi": 11, "Bishnupur": 9, "Bariyarpatti": 9, 
      "Lakshmipur Patari": 9, "Naraha": 9, "Sakhuwanankarkatti": 9, 
      "Arnama": 9, "Navarajpur": 7
    }
  },
  "Bagmati": {
    "Sindhuli": {
      "Kamalamai": 14, "Dudhauli": 13, "Sunkoshi": 11, "Hariharpur Gadhi": 10, 
      "Tinpatan": 9, "Marin": 9, "Golanjor": 9, "Phikkal": 7, "Ghyanglekh": 9
    },
    "Ramechhap": {
      "Manthali": 13, "Ramechhap": 9, "Umakunda": 9, "Khandadevi": 9, 
      "Doramba": 9, "Gokulganga": 8, "Likhu Tamakoshi": 6, "Sunapati": 5
    },
    "Dolakha": {
      "Bhimeshwar": 13, "Jiri": 9, "Baiteshwar": 9, "Gaurishankar": 11, 
      "Kalinchok": 9, "Melung": 9, "Bigu": 9, "Shailung": 9, "Tamakoshi": 9
    },
    "Bhaktapur": {
      "Bhaktapur": 10, "Changunarayan": 9, "Madhyapur Thimi": 9, "Suryabinayak": 10
    },
    "Dhading": {
      "Dhunibeshi": 11, "Nilkantha": 13, "Khaniyabas": 11, "Gajuri": 12, 
      "Galchhi": 8, "Gangajamuna": 10, "Jwalamukhi": 8, "Thakre": 9, 
      "Netrawati Dabajong": 7, "Benighat Rorang": 11, "Rubi Valley": 9, 
      "Siddhalek": 7, "Tripura Sundari": 7
    },
    "Kathmandu": {
      "Kathmandu": 32, "Kageshwari Manohara": 9, "Kirtipur": 10, "Gokarneshwar": 9, 
      "Chandragiri": 15, "Tokha": 11, "Tarakeshwar": 11, "Dakshinkali": 9, 
      "Nagarjun": 10, "Budhanilkantha": 13, "Shankharapur": 9
    },
    "Kavrepalanchok": {
      "Dhulikhel": 12, "Banepa": 14, "Panauti": 12, "Panchkhal": 13, 
      "Namobuddha": 11, "Mandan Deupur": 13, "Khanikhola": 7, "Chauri Deurali": 9, 
      "Bhumlu": 9, "Mahabharat": 8, "Roshi": 14, "Temal": 10, "Bethanchok": 9, 
      "Chaurideurali": 9
    },
    "Lalitpur": {
      "Lalitpur": 29, "Godawari": 14, "Mahalaxmi": 10, "Konjyosom": 7, 
      "Bagmati": 11, "Mahankal": 6
    },
    "Nuwakot": {
      "Bidur": 13, "Belkotgadhi": 13, "Kakani": 8, "Panchakanya": 9, "Likhu": 6, 
      "Dupcheshwar": 7, "Shivapuri": 9, "Tadi": 9, "Tarkeshwar": 11, 
      "Kispang": 5, "Myagang": 5, "Suryagadhi": 5
    },
    "Rasuwa": {
      "Uttar Gaya": 9, "Kalika": 9, "Gosaikunda": 5, "Naukunda": 5, "Parbatikunda": 5
    },
    "Sindhupalchok": {
      "Chautara Sangachokgadhi": 14, "Barhabise": 9, "Melamchi": 13, "Jugal": 7, 
      "Balefi": 9, "Sunkoshi": 9, "Indrawati": 13, "Lisangkhu Pakhar": 9, 
      "Helambu": 7, "Panchpokhari Thangpal": 9, "Balephi": 7, "Tripura Sundari": 9
    },
    "Chitwan": {
      "Bharatpur": 29, "Kalika": 11, "Khairahani": 13, "Madi": 9, "Ratnanagar": 16, 
      "Rapti": 14, "Ichchhakamana": 7
    },
    "Makwanpur": {
      "Hetauda": 19, "Thaha": 13, "Indrasarowar": 14, "Kailash": 14, "Bakaiya": 11, 
      "Bagmati": 12, "Bhimphedi": 9, "Makawanpurgadhi": 11, "Manahari": 9, 
      "Raksirang": 10
    }
  },
  "Gandaki": {
    "Baglung": {
      "Baglung": 14, "Dhorpatan": 7, "Galkot": 11, "Jaimuni": 9, "Bareng": 9, 
      "Khathekhola": 5, "Taman Khola": 6, "Tara Khola": 5, "Nisikhola": 7, 
      "Badigad": 9
    },
    "Gorkha": {
      "Gorkha": 17, "Palungtar": 13, "Sulikot": 9, "Siranchok": 9, "Ajirkot": 7, 
      "Tsum Nubri": 5, "Dharche": 7, "Bhimsen Thapa": 9, "Sahid Lakhan": 9, 
      "Aarughat": 11, "Gandaki": 7
    },
    "Kaski": {
      "Pokhara": 33, "Annapurna": 11, "Machhapuchchhre": 9, "Madi": 12, "Rupa": 7
    },
    "Lamjung": {
      "Besisahar": 11, "Madhya Nepal": 9, "Rainas": 11, "Sundarbazar": 11, 
      "Kwhlosothar": 10, "Dudhpokhari": 5, "Dordi": 9, "Marsyangdi": 9
    },
    "Manang": {
      "Chame": 5, "Nason": 9, "Narpa Bhumi": 9, "Manang Ngisyang": 9
    },
    "Mustang": {
      "Gharpajhong": 5, "Thasang": 5, "Barhagaun Muktichhetra": 5, "Lomanthang": 5, 
      "Lo-Ghekar Damodarkunda": 5
    },
    "Myagdi": {
      "Beni": 10, "Annapurna": 9, "Dhaulagiri": 7, "Mangala": 9, "Malika": 7, 
      "Raghuganga": 9
    },
    "Nawalpur": {
      "Kawasoti": 19, "Gaindakot": 11, "Devchuli": 19, "Madhyabindu": 11, 
      "Baudikali": 9, "Bulingtar": 10, "Binayi Tribeni": 6, "Hupsekot": 9
    },
    "Parbat": {
      "Kushma": 12, "Phalebas": 9, "Jaljala": 9, "Paiyun": 11, "Mahashila": 9, 
      "Modi": 10, "Bihadi": 9
    },
    "Syangja": {
      "Galyang": 11, "Chapakot": 9, "Putalibazar": 15, "Bheerkot": 9, "Waling": 14, 
      "Arjun Chaupari": 12, "Adarsha": 7, "Phedikhola": 9, "Harinas": 12, 
      "Biruwa": 9, "Kaligandaki": 9
    },
    "Tanahun": {
      "Bhanu": 13, "Bhimad": 10, "Byas": 14, "Shuklagandaki": 12, "Anbukhaireni": 9, 
      "Devghat": 9, "Bandipur": 6, "Rishing": 9, "Ghiring": 11, "Myagde": 9
    }
  },
  "Lumbini": {
    "Kapilvastu": {
      "Kapilbastu": 14, "Banganga": 14, "Buddhabhumi": 14, "Shivaraj": 14, 
      "Krishnanagar": 14, "Maharajgunj": 10, "Mayadevi": 9, "Yashodhara": 12, 
      "Suddhodhan": 9, "Bijaynagar": 9
    },
    "Parasi": {
      "Bardaghat": 19, "Ramgram": 18, "Sunwal": 14, "Susta": 5, "Palhi Nandan": 9, 
      "Pratappur": 9, "Sarawal": 11
    },
    "Rupandehi": {
      "Butwal": 19, "Devdaha": 11, "Lumbini Sanskritik": 13, "Sainamaina": 17, 
      "Siddharthanagar": 19, "Tilottama": 18, "Gaidahawa": 14, "Kanchan": 9, 
      "Kotahimai": 9, "Marchawari": 9, "Mayadevi": 9, "Omsatiya": 9, "Rohini": 10, 
      "Sammarimai": 9, "Siyari": 9, "Sudhdhodhan": 9
    },
    "Arghakhanchi": {
      "Sandhikharka": 11, "Sitganga": 9, "Bhumikasthan": 9, "Chhatradev": 9, 
      "Panini": 9, "Malarani": 9
    },
    "Gulmi": {
      "Musikot": 9, "Resunga": 14, "Isma": 7, "Kaligandaki": 11, "Gulmidarbar": 9, 
      "Satyawati": 9, "Chandrakot": 9, "Ruru": 9, "Chatrakot": 8, "Dhurkot": 9, 
      "Madane": 9, "Malika": 9
    },
    "Palpa": {
      "Tansen": 17, "Rampur": 14, "Rainadevi Chhahara": 9, "Ribdikot": 9, 
      "Purbakhola": 9, "Rambha": 9, "Mathagadhi": 9, "Tinahu": 9, "Nisdi": 9, 
      "Baganaskali": 7
    },
    "Dang": {
      "Ghorahi": 19, "Tulsipur": 19, "Lamahi": 13, "Gadhawa": 7, "Rajpur": 9, 
      "Shantinagar": 9, "Rapti": 9, "Babai": 9, "Dangisharan": 9, "Banglachuli": 10
    },
    "Pyuthan": {
      "Pyuthan": 13, "Sworgadwary": 14, "Gaumukhi": 7, "Mandavi": 9, 
      "Sarumarani": 9, "Mallarani": 9, "Naubahini": 9, "Jhimruk": 9, "Airawati": 9
    },
    "Rolpa": {
      "Rolpa": 9, "Runtigadhi": 9, "Triveni": 9, "Sunchhahari": 11, "Lungri": 9, 
      "Gangadev": 9, "Madi": 9, "Thawang": 9, "Pariwartan": 5, "Sunil Smriti": 5
    },
    "Eastern Rukum": {
      "Bhume": 9, "Sisne": 8, "Putha Uttarganga": 9
    },
    "Banke": {
      "Nepalgunj": 23, "Kohalpur": 14, "Rapti Sonari": 14, "Narainapur": 11, 
      "Duduwa": 9, "Janaki": 9, "Khajura": 9, "Baijanath": 9
    },
    "Bardiya": {
      "Gulariya": 19, "Madhuwan": 9, "Rajapur": 9, "Thakurbaba": 9, "Bansgadhi": 9, 
      "Barbardiya": 9, "Badhaiyatal": 9, "Geruwa": 9
    }
  },
  "Karnali": {
    "Western Rukum": {
      "Musikot": 9, "Chaurjahari": 14, "Aathbiskot": 9, "Banphikot": 7, 
      "Tribeni": 9, "Sani Bheri": 9
    },
    "Salyan": {
      "Sharada": 14, "Bagchaur": 11, "Bangad Kupinde": 10, "Kalimati": 9, 
      "Tribeni": 9, "Kapurkot": 9, "Chhatreshwari": 9, "Kumakh": 9, 
      "Siddha Kumakh": 7, "Darma": 9
    },
    "Dolpa": {
      "Thuli Bheri": 9, "Tripurasundari": 9, "Dolpo Buddha": 6, "She Phoksundo": 5, 
      "Jagadulla": 7, "Mudkechula": 5, "Kaike": 5, "Chharka Tangsong": 5
    },
    "Humla": {
      "Simkot": 9, "Namkha": 7, "Kharpunath": 7, "Sarkegad": 5, "Chankheli": 5, 
      "Adanchuli": 5, "Tanjakot": 5
    },
    "Jumla": {
      "Chandannath": 10, "Kankasundari": 8, "Sinja": 7, "Hima": 9, "Tila": 9, 
      "Guthichaur": 5, "Tatopani": 9, "Patarasi": 9
    },
    "Kalikot": {
      "Khandachakra": 9, "Raskot": 9, "Tilagufa": 9, "Pachaljharana": 9, 
      "Sanni Triveni": 9, "Narharinath": 9, "Shubha Kalika": 9, "Mahawai": 9, 
      "Palata": 9
    },
    "Mugu": {
      "Chhayanath Rara": 9, "Mugum Karmarong": 9, "Soru": 5, "Khatyad": 5
    },
    "Surkhet": {
      "Birendranagar": 16, "Bheriganga": 13, "Gurbha Kot": 9, "Panchapuri": 11, 
      "Lekbeshi": 9, "Chaukune": 9, "Barahatal": 9, "Chingad": 9, "Simta": 9
    }
  },
  "Sudurpashchim": {
    "Bajura": {
      "Badimalika": 9, "Triveni": 9, "Budhiganga": 9, "Budhinanda": 9, "Gaumul": 9, 
      "Jagannath": 9, "Swamikartik Khapar": 7, "Chhededaha": 7, "Himali": 9
    },
    "Bajhang": {
      "Jaya Prithvi": 9, "Bungal": 9, "Talkot": 9, "Masta": 9, "Khaptad Chhanna": 9, 
      "Thalara": 9, "Bitthadchir": 9, "Surma": 9, "Chhabis Pathibhera": 9, 
      "Durgathali": 9, "Kedarsyu": 7, "Saipal": 5
    },
    "Doti": {
      "Dipayal Silgadhi": 9, "Shikhar": 9, "Purbichauki": 9, "Badikedar": 9, 
      "Jorayal": 9, "Sayal": 9, "Aadarsha": 7, "K I Singh": 9, "Bogtan": 9
    },
    "Achham": {
      "Mangalsen": 14, "Kamalbazar": 9, "Sanphebagar": 13, "Panchadewal Binayak": 10, 
      "Chaurpati": 9, "Mellekh": 9, "Bannigadi Jayagad": 9, "Ramaroshan": 9, 
      "Turmakhand": 9, "Dhakari": 9
    },
    "Darchula": {
      "Mahakali": 9, "Shailyashikhar": 7, "Malikarjun": 5, "Apihimal": 9, 
      "Duhun": 5, "Naugad": 7, "Marma": 9, "Lekam": 5, "Vyans": 9
    },
    "Baitadi": {
      "Dasharathchanda": 9, "Patan": 9, "Melauli": 9, "Purchaudi": 11, "Surnaya": 9, 
      "Sigas": 9, "Shivanath": 9, "Pancheshwar": 9, "Dogdakedar": 9, "Dilasaini": 9
    },
    "Dadeldhura": {
      "Amargadhi": 10, "Parshuram": 9, "Aalitaal": 7, "Bhageshwar": 7, 
      "Navadurga": 7, "Ajaymeru": 7, "Ganyapadhura": 9
    },
    "Kanchanpur": {
      "Bhimdatta": 19, "Punarbas": 9, "Bedkot": 10, "Mahakali": 9, 
      "Shuklaphanta": 9, "Belauri": 9, "Krishnapur": 9, "Beldandi": 9, "Laljhadi": 9
    },
    "Kailali": {
      "Dhangadhi": 19, "Lamki Chuha": 9, "Tikapur": 9, "Ghodaghodi": 10, 
      "Bhajani": 9, "Godawari": 7, "Gauriganga": 9, "Janaki": 7, "Bardagoriya": 9, 
      "Mohanyal": 9, "Kailari": 9, "Joshipur": 9, "Chure": 9
    }
  }
};

const useNepalAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipals, setMunicipals] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMunicipal, setSelectedMunicipal] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Load provinces on mount
  useEffect(() => {
    setProvinces(Object.keys(nepalAddressData));
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince && nepalAddressData[selectedProvince]) {
      setDistricts(Object.keys(nepalAddressData[selectedProvince]));
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setMunicipals([]);
    setWards([]);
    setSelectedWard("");
  }, [selectedProvince]);

  // Load municipalities when district changes
  useEffect(() => {
    if (selectedProvince && selectedDistrict && nepalAddressData[selectedProvince]?.[selectedDistrict]) {
      setMunicipals(Object.keys(nepalAddressData[selectedProvince][selectedDistrict]));
    } else {
      setMunicipals([]);
    }
    setSelectedMunicipal("");
    setWards([]);
    setSelectedWard("");
  }, [selectedDistrict, selectedProvince]);

  // Load wards when municipality changes
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedMunicipal) {
      const wardCount = nepalAddressData[selectedProvince]?.[selectedDistrict]?.[selectedMunicipal];
      if (wardCount) {
        const wardsArray = Array.from({ length: wardCount }, (_, i) => `Ward ${i + 1}`);
        setWards(wardsArray);
      } else {
        setWards([]);
      }
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedMunicipal, selectedProvince, selectedDistrict]);

  return {
    provinces,
    districts,
    municipals,
    wards,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedMunicipal,
    setSelectedMunicipal,
    selectedWard,
    setSelectedWard,
  };
};

export default useNepalAddress;