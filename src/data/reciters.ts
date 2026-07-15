export interface QuranReciter {
  id: string;
  name: string;
  nameAr: string;
  country: string;
  server: string;
  apiId: string;
  hasDirectApi: boolean;
}

export const QURAN_RECITERS: QuranReciter[] = [
  {
    "id": "mp3quran-1-1",
    "name": "Ibrahime Al Akhdar (Mujawwad)",
    "nameAr": "إبراهيم الأخضر (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/akdr/",
    "apiId": "ar.ibrahimakhbar",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-10-10",
    "name": "Akram Alalaqmi (Mujawwad)",
    "nameAr": "أكرم العلاقمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/akrm/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-100-100",
    "name": "Majed Al Enezi (Mujawwad)",
    "nameAr": "ماجد العنزي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/majd_onazi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-102-133",
    "name": "Maher Al Meaqli (Mujawwad)",
    "nameAr": "ماهر المعيقلي (المصحف المجود - المصحف المجود)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/maher/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.mahermuaiqly",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-102-103",
    "name": "Maher Al Meaqli (Hafs)",
    "nameAr": "ماهر المعيقلي (المصحف المعلم - المصحف المعلم)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/maher/Almusshaf-Al-Mo-lim/",
    "apiId": "ar.mahermuaiqly",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-102-102",
    "name": "Maher Al Meaqli (Mujawwad)",
    "nameAr": "ماهر المعيقلي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/maher/",
    "apiId": "ar.mahermuaiqly",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-104-104",
    "name": "Mohammad Al-Airawy (Warsh)",
    "nameAr": "محمد الأيراوي (ورش عن نافع من طريق الأزرق - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/earawi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-105-105",
    "name": "Mohamed El Barak (Mujawwad)",
    "nameAr": "محمد البراك (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server13.mp3quran.net/braak/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-106-10912",
    "name": "Mohamed Tablaoui (Mujawwad)",
    "nameAr": "محمد الطبلاوي (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server12.mp3quran.net/tblawi/Al-Mojawwad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-106-106",
    "name": "Mohamed Tablaoui (Mujawwad)",
    "nameAr": "محمد الطبلاوي (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server12.mp3quran.net/tblawi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-107-107",
    "name": "Mohamed El Louhaydan (Mujawwad)",
    "nameAr": "محمد اللحيدان (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/lhdan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-108-108",
    "name": "Mohammed El-Muhasny (Mujawwad)",
    "nameAr": "محمد المحيسني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/mhsny/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-109-320",
    "name": "Mohamed Ayoub (Hafs)",
    "nameAr": "محمد أيوب (حفص عن عاصم - 4)",
    "country": "Arabie Saoudite",
    "server": "https://server16.mp3quran.net/ayyoub2/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.muhammadayyoub",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-109-109",
    "name": "Mohamed Ayoub (Mujawwad)",
    "nameAr": "محمد أيوب (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/ayyub/",
    "apiId": "ar.muhammadayyoub",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-11-11",
    "name": "Alhouceyni Al-Azazi (Hafs)",
    "nameAr": "الحسيني العزازي (المصحف المعلم - المصحف المعلم)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/3zazi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-110-110",
    "name": "Mohammad Saleh Alim Shah (Mujawwad)",
    "nameAr": "محمد صالح عالم شاه (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/shah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-111-111",
    "name": "Mohamed Jibreel (Mujawwad)",
    "nameAr": "محمد جبريل (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/jbrl/",
    "apiId": "ar.muhammadjibreel",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-112-114",
    "name": "Mohamed Seddik El Manchaoui (Hafs)",
    "nameAr": "محمد صديق المنشاوي (المصحف المعلم - المصحف المعلم)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mo-lim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-112-113",
    "name": "Mohamed Seddik El Manchaoui (Mujawwad)",
    "nameAr": "محمد صديق المنشاوي (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-112-112",
    "name": "Mohamed Seddik El Manchaoui (Mujawwad)",
    "nameAr": "محمد صديق المنشاوي (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/minsh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-115-210",
    "name": "Mohamed Abdelkarime (Warsh)",
    "nameAr": "محمد عبدالكريم (ورش عن نافع من طريق أبي بكر الأصبهاني - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-115-115",
    "name": "Mohamed Abdelkarime (Mujawwad)",
    "nameAr": "محمد عبدالكريم (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/m_krm/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-116-117",
    "name": "Mohammad Al-Abdullah (Mujawwad)",
    "nameAr": "محمد عبدالحكيم سعيد العبدالله (الدوري عن الكسائي - مرتل)",
    "country": "Égypte",
    "server": "https://server9.mp3quran.net/abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-116-116",
    "name": "Mohammad Al-Abdullah (Mujawwad)",
    "nameAr": "محمد عبدالحكيم سعيد العبدالله (البزي وقنبل عن ابن كثير - مرتل)",
    "country": "Égypte",
    "server": "https://server9.mp3quran.net/abdullah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-118-270",
    "name": "Mahmoud Khalil Al-Hussary (Mujawwad)",
    "nameAr": "محمود خليل الحصري (قالون عن نافع - مرتل)",
    "country": "Égypte",
    "server": "https://server13.mp3quran.net/husr/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.husarymujawwad",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-118-269",
    "name": "Mahmoud Khalil Al-Hussary (Al-Duri)",
    "nameAr": "محمود خليل الحصري (الدوري عن أبي عمرو - مرتل)",
    "country": "Égypte",
    "server": "https://server13.mp3quran.net/husr/Rewayat-Aldori-A-n-Abi-Amr/",
    "apiId": "ar.husary",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-118-120",
    "name": "Mahmoud Khalil Al-Hussary (Warsh)",
    "nameAr": "محمود خليل الحصري (ورش عن نافع - مرتل)",
    "country": "Égypte",
    "server": "https://server13.mp3quran.net/husr/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.husary",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-118-119",
    "name": "Mahmoud Khalil Al-Hussary (Mujawwad)",
    "nameAr": "محمود خليل الحصري (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.husarymujawwad",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-118-118",
    "name": "Mahmoud Khalil Al-Hussary (Mujawwad)",
    "nameAr": "محمود خليل الحصري (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server13.mp3quran.net/husr/",
    "apiId": "ar.husarymujawwad",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-12-12",
    "name": "Idrees Abkr (Mujawwad)",
    "nameAr": "إدريس أبكر (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/abkr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-121-122",
    "name": "Mahmoud Ali  Albanna (Mujawwad)",
    "nameAr": "محمود علي البنا (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/bna/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-121-121",
    "name": "Mahmoud Ali  Albanna (Mujawwad)",
    "nameAr": "محمود علي البنا (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/bna/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-123-124",
    "name": "Mishary Al Afasi (Mujawwad)",
    "nameAr": "مشاري العفاسي (الدوري عن الكسائي - مرتل)",
    "country": "Koweït",
    "server": "https://server8.mp3quran.net/afs/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-123-123",
    "name": "Mishary Al Afasi (Mujawwad)",
    "nameAr": "مشاري العفاسي (حفص عن عاصم - مرتل)",
    "country": "Koweït",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-125-288",
    "name": "Mustafa Ismail (Mujawwad)",
    "nameAr": "مصطفى إسماعيل (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/mustafa/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-125-125",
    "name": "Mustafa Ismail (Mujawwad)",
    "nameAr": "مصطفى إسماعيل (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/mustafa/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-126-126",
    "name": "Mustafa Al Lahoni (Mujawwad)",
    "nameAr": "مصطفى اللاهوني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/lahoni/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-127-127",
    "name": "Mustafa raad Alazawy (Mujawwad)",
    "nameAr": "مصطفى رعد العزاوي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/ra3ad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-128-128",
    "name": "Muamar (From Indonesia) (Mujawwad)",
    "nameAr": "معمر الأندونيسي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/muamr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-129-196",
    "name": "Muftah Alsaltany (Mujawwad)",
    "nameAr": "مفتاح السلطني (ابن ذكوان عن ابن عامر - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/muftah_sultany/Rewayat_Ibn-Thakwan-A-n-Ibn-Amer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-129-195",
    "name": "Muftah Alsaltany (Mujawwad)",
    "nameAr": "مفتاح السلطني (شعبة  عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/muftah_sultany/Rewayat_Sho-bah-A-n-Asim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-129-182",
    "name": "Muftah Alsaltany (Mujawwad)",
    "nameAr": "مفتاح السلطني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/muftah_sultany/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-129-180",
    "name": "Muftah Alsaltany (Mujawwad)",
    "nameAr": "مفتاح السلطني (الدوري عن الكسائي - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/muftah_sultany/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-129-129",
    "name": "Muftah Alsaltany (Al-Duri)",
    "nameAr": "مفتاح السلطني (الدوري عن أبي عمرو - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/muftah_sultany/Rewayat-Aldori-A-n-Abi-Amr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-13-13",
    "name": "Alzain Mohammad Ahmad (Mujawwad)",
    "nameAr": "الزين محمد أحمد (حفص عن عاصم - مرتل)",
    "country": "Soudan",
    "server": "https://server9.mp3quran.net/alzain/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-134-134",
    "name": "Mohammad Saayed (Warsh)",
    "nameAr": "محمد سايد (ورش عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/m_sayed/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-135-135",
    "name": "Abdulrahman Alsuwayid (Mujawwad)",
    "nameAr": "عبدالرحمن السويّد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_swaiyd/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-136-136",
    "name": "Abdulelah bin Aoun (Mujawwad)",
    "nameAr": "عبدالإله بن عون (حفص عن عاصم - مرتل)",
    "country": "Koweït",
    "server": "https://server16.mp3quran.net/a_binaoun/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-137-137",
    "name": "Ahmad Talib bin Humaid (Mujawwad)",
    "nameAr": "أحمد طالب بن حميد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_binhameed/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-138-138",
    "name": "Noreen Mohammad Siddiq (Al-Duri)",
    "nameAr": "نورين محمد صديق (الدوري عن أبي عمرو - مرتل)",
    "country": "Soudan",
    "server": "https://server16.mp3quran.net/nourin_siddig/Rewayat-Aldori-A-n-Abi-Amr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-139-139",
    "name": "Majed Al-Zamil (Mujawwad)",
    "nameAr": "ماجد الزامل (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/zaml/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-14-14",
    "name": "Al-Qaria Yassen (Warsh)",
    "nameAr": "القارئ ياسين (ورش عن نافع - مرتل)",
    "country": "Algérie",
    "server": "https://server11.mp3quran.net/qari/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-149-149",
    "name": "Maher Shakhashero (Mujawwad)",
    "nameAr": "ماهر شخاشيرو (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server10.mp3quran.net/shaksh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-15-15",
    "name": "Alashri Omran (Mujawwad)",
    "nameAr": "العشري عمران (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/omran/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-150-150",
    "name": "Mohammad AlMonshed (Mujawwad)",
    "nameAr": "محمد المنشد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server10.mp3quran.net/monshed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-151-151",
    "name": "Mahmood AlSheimy (Mujawwad)",
    "nameAr": "محمود الشيمي (الدوري عن الكسائي - مرتل)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/sheimy/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-152-152",
    "name": "Yasser Salamah (Mujawwad)",
    "nameAr": "ياسر سلامة (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-153-153",
    "name": "Akhil Abdelhay rawa (Mujawwad)",
    "nameAr": "أخيل عبدالحي روا (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/akil/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-154-154",
    "name": "Oustad  Zamri (Mujawwad)",
    "nameAr": "أستاذ زامري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/zamri/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-159-159",
    "name": "Khalid Almohana (Mujawwad)",
    "nameAr": "خالد المهنا (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/mohna/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-16-16",
    "name": "Aloyoun Al Kouchi (Warsh)",
    "nameAr": "العيون الكوشي (ورش عن نافع - مرتل)",
    "country": "Koweït",
    "server": "https://server11.mp3quran.net/koshi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-160-160",
    "name": "Adel Al-Khalbany (Mujawwad)",
    "nameAr": "عادل الكلباني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/a_klb/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-161-161",
    "name": "Mousa Bilal (Mujawwad)",
    "nameAr": "موسى بلال (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/bilal/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-162-162",
    "name": "Hussain Alshaik (Mujawwad)",
    "nameAr": "حسين آل الشيخ (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/alshaik/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-163-163",
    "name": "Hatem Fareed Alwaer (Mujawwad)",
    "nameAr": "حاتم فريد الواعر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/hatem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-164-164",
    "name": "Ibrahim Aljormy (Mujawwad)",
    "nameAr": "إبراهيم الجرمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/jormy/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-165-165",
    "name": "Mahmood Al rifai (Mujawwad)",
    "nameAr": "محمود الرفاعي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/mrifai/",
    "apiId": "ar.hanirifai",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-166-166",
    "name": "Nasser Al obaid (Mujawwad)",
    "nameAr": "ناصر العبيد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/obaid/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-167-167",
    "name": "Wasel Almethen (Mujawwad)",
    "nameAr": "واصل المذن (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/wasel/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-17-17",
    "name": "Taoufiq El Saegh (Mujawwad)",
    "nameAr": "توفيق الصايغ (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/twfeeq/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-178-232",
    "name": "Ibrahim Aldosari (Mujawwad)",
    "nameAr": "إبراهيم الدوسري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/ibrahim_dosri/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-178-178",
    "name": "Ibrahim Aldosari (Warsh)",
    "nameAr": "إبراهيم الدوسري (ورش عن نافع - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/ibrahim_dosri/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-18-18",
    "name": "Jamal Shaker Abdullah (Mujawwad)",
    "nameAr": "جمال شاكر عبدالله (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/jamal/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-181-181",
    "name": "Jamaan Alosaimi (Mujawwad)",
    "nameAr": "جمعان العصيمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/jaman/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-183-183",
    "name": "Rodziah Abdulrahman (Mujawwad)",
    "nameAr": "رضية عبدالرحمن (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/rziah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-184-184",
    "name": "Rogayah Sulong (Mujawwad)",
    "nameAr": "رقية سولونق (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/rogiah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-185-185",
    "name": "Sapinah Mamat (Mujawwad)",
    "nameAr": "سابينة مامات (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/mamat/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-187-187",
    "name": "Saidin Abdulrahman (Mujawwad)",
    "nameAr": "سيدين عبدالرحمن (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server12.mp3quran.net/malaysia/sideen/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-188-188",
    "name": "Abdulghani Abdullah (Mujawwad)",
    "nameAr": "عبدالغني عبدالله (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/abdulgani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-189-189",
    "name": "Abdullah Fahmi (Mujawwad)",
    "nameAr": "عبدالله فهمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/fhmi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-19-19",
    "name": "Hamad Al Daghriri (Mujawwad)",
    "nameAr": "حمد الدغريري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/hamad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-190-190",
    "name": "Muhammad Al-Hafiz (Mujawwad)",
    "nameAr": "محمد الحافظ (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/hafz/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-191-191",
    "name": "Mohammed Hafas Ali (Mujawwad)",
    "nameAr": "محمد حفص علي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/hfs/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-192-192",
    "name": "Muhammed Khairul Anuar (Mujawwad)",
    "nameAr": "محمد خير النور (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/malaysia/nor/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-193-193",
    "name": "Yousef Bin Noah Ahmad (Mujawwad)",
    "nameAr": "يوسف بن نوح أحمد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/noah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-194-194",
    "name": "Jamal Addeen Alzailaie (Mujawwad)",
    "nameAr": "جمال الدين الزيلعي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/zilaie/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-197-197",
    "name": "Moeedh Alharthi (Mujawwad)",
    "nameAr": "معيض الحارثي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/harthi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-198-198",
    "name": "Mohammad Rashad Alshareef (Mujawwad)",
    "nameAr": "محمد رشاد الشريف (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/rashad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-2-2",
    "name": "Ibrahime Al Jebrine (Mujawwad)",
    "nameAr": "إبراهيم الجبرين (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/jbreen/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-20-20",
    "name": "Khaled Al Jalille (Mujawwad)",
    "nameAr": "خالد الجليل (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/jleel/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-201-201",
    "name": "Ahmed Al-trabulsi (Mujawwad)",
    "nameAr": "أحمد الطرابلسي (حفص عن عاصم - مرتل)",
    "country": "Syrie",
    "server": "https://server10.mp3quran.net/trabulsi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-201-199",
    "name": "Ahmed Al-trabulsi (Mujawwad)",
    "nameAr": "أحمد الطرابلسي (قالون عن نافع - مرتل)",
    "country": "Syrie",
    "server": "https://server10.mp3quran.net/trablsi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-202-202",
    "name": "Abdullah Kandari (Mujawwad)",
    "nameAr": "عبدالله الكندري (حفص عن عاصم - مرتل)",
    "country": "Koweït",
    "server": "https://server10.mp3quran.net/Abdullahk/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-203-203",
    "name": "Ahmed Amer (Mujawwad)",
    "nameAr": "أحمد عامر (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server10.mp3quran.net/Aamer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-204-204",
    "name": "Ibrahem Assadan (Mujawwad)",
    "nameAr": "إبراهيم السعدان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server10.mp3quran.net/IbrahemSadan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-205-205",
    "name": "Ahmad Alhuthaifi (Mujawwad)",
    "nameAr": "أحمد الحذيفي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/ahmad_huth/",
    "apiId": "ar.hudhaify",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-206-206",
    "name": "Mohammed Osman Khan (Mujawwad)",
    "nameAr": "محمد عثمان خان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/khan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-207-207",
    "name": "Youssef Edghouch (Mujawwad)",
    "nameAr": "يوسف الدغوش (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server7.mp3quran.net/dgsh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-208-208",
    "name": "Addokali Mohammad Alalim (Mujawwad)",
    "nameAr": "الدوكالي محمد العالم (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server7.mp3quran.net/dokali/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-209-209",
    "name": "Wishear Hayder Arbili (Mujawwad)",
    "nameAr": "وشيار حيدر اربيلي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/wishear/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21-21",
    "name": "Khaled Al Kahtani (Mujawwad)",
    "nameAr": "خالد القحطاني (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/qht/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-211-211",
    "name": "Alfateh Alzubair (Al-Duri)",
    "nameAr": "الفاتح محمد الزبير (الدوري عن أبي عمرو - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/fateh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21136-10914",
    "name": "Abdullah Alqarafi (Mujawwad)",
    "nameAr": "عبدالله القرافي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_alqrafi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21148-10915",
    "name": "Abdulbadi Ghailan (Mujawwad)",
    "nameAr": "عبدالبديع غيلان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/A-Ghailan/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21181-340",
    "name": "Muhammad Burhaji (Mujawwad)",
    "nameAr": "محمد برهجي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/M_Burhaji/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21182-10904",
    "name": "Yusuf ALaidroos (Hafs)",
    "nameAr": "يوسف العيدروس (حفص عن عاصم - 4)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/Y_ALaidroos/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21183-10905",
    "name": "Hassan Aldaghriri (Mujawwad)",
    "nameAr": "حسن الدغريري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/H-Aldaghriri/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21184-10906",
    "name": "Muhammad Al Faqih (Mujawwad)",
    "nameAr": "محمد الفقيه (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/M_Alfaqih/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21186-10908",
    "name": "Junaid Adam Abdullah (Mujawwad)",
    "nameAr": "جنيد آدم عبدالله (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/J-Abdullah/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21187-10909",
    "name": "Khalid Alziyadi (Mujawwad)",
    "nameAr": "خالد الزيادي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server16.mp3quran.net/K-Alzadi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21188-10910",
    "name": "Al-Waleed Al-Chamsane (Mujawwad)",
    "nameAr": "الوليد الشمسان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/shamsan/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21191-10911",
    "name": "Ibrahim Al-Shahri (Mujawwad)",
    "nameAr": "إبراهيم الشهري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/Ibrahim-Al-Shahri/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21193-10913",
    "name": "Abdul Rahman bin Abdul Razzaq Al Badr (Mujawwad)",
    "nameAr": "عبدالرحمن بن عبدالرزاق البدر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/A-AlBadr/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21196-10917",
    "name": "Alijon Qori (Mujawwad)",
    "nameAr": "عليجان قوري حمدان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/Alijon/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21197-10918",
    "name": "Mohammed Al-Zubaidi (Mujawwad)",
    "nameAr": "محمد الزبيدي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/M-AlZubaidi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21199-10920",
    "name": "Abdelmoujib Benkirane (Warsh)",
    "nameAr": "عبد المجيب بنكيران (ورش عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/A-Benkirane/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-212-212",
    "name": "Tareq Abdulgani daawob (Mujawwad)",
    "nameAr": "طارق عبدالغني دعوب (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server10.mp3quran.net/tareq/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21201-10922",
    "name": "Asim Al-Luhaidan (Mujawwad)",
    "nameAr": "عاصم اللحیدان (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server7.mp3quran.net/asim/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-21202-10923",
    "name": "Mahmoud Harfoush (Mujawwad)",
    "nameAr": "محمود حرفوش (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server16.mp3quran.net/M-Harfoush/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-216-216",
    "name": "Othman Al-Ansary (Mujawwad)",
    "nameAr": "عثمان الأنصاري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/Othmn/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-217-217",
    "name": "Bandar Balilah (Mujawwad)",
    "nameAr": "بندر بليله (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/balilah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-218-218",
    "name": "Khalid Al-Shoraimy (Mujawwad)",
    "nameAr": "خالد الشريمي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/shoraimy/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-219-219",
    "name": "Wadeea Al-Yamani (Mujawwad)",
    "nameAr": "وديع اليمني (حفص عن عاصم - مرتل)",
    "country": "Yémen",
    "server": "https://server6.mp3quran.net/wdee3/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-22-22",
    "name": "Khaled Abdelkafi (Mujawwad)",
    "nameAr": "خالد عبدالكافي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/kafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-221-221",
    "name": "Raad Al Kurdi (Mujawwad)",
    "nameAr": "رعد محمد الكردي (حفص عن عاصم - مرتل)",
    "country": "Syrie",
    "server": "https://server6.mp3quran.net/kurdi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-225-225",
    "name": "Abdulrahman Aloosi (Mujawwad)",
    "nameAr": "عبدالرحمن العوسي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/aloosi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-226-226",
    "name": "Khalid Algamdi (Mujawwad)",
    "nameAr": "خالد الغامدي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/ghamdi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-227-227",
    "name": "Ramadan Shakoor (Mujawwad)",
    "nameAr": "رمضان شكور (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/shakoor/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-228-228",
    "name": "Abdulmajeed Al-Arkani (Mujawwad)",
    "nameAr": "عبدالمجيد الأركاني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server7.mp3quran.net/m_arkani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-229-229",
    "name": "Mohammad Khalil Al-Qari (Mujawwad)",
    "nameAr": "محمد خليل القارئ (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/m_qari/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-23-23",
    "name": "Khaled Al-Wahibi (Mujawwad)",
    "nameAr": "خالد الوهيبي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/whabi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-230-230",
    "name": "Rami Aldeais (Mujawwad)",
    "nameAr": "رامي الدعيس (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/rami/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-231-231",
    "name": "Hazza Al-Balushi (Mujawwad)",
    "nameAr": "هزاع البلوشي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/hazza/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-236-236",
    "name": "Abdulrahman Al-Majed (Mujawwad)",
    "nameAr": "عبدالرحمن الماجد (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/a_majed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-237-287",
    "name": "Marwan Alakri (Mujawwad)",
    "nameAr": "مروان العكري (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/m_akri/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-24-24",
    "name": "Khalifa Altunaiji (Mujawwad)",
    "nameAr": "خليفة الطنيجي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/tnjy/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-240-240",
    "name": "Salman Alotaibi (Mujawwad)",
    "nameAr": "سلمان العتيبي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/salman/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-241-241",
    "name": "Mohammad Refat (Mujawwad)",
    "nameAr": "محمد رفعت (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/refat/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-243-286",
    "name": "Abdullah Al Moussâ (Hafs)",
    "nameAr": "عبدالله الموسى (المصحف المعلم - المصحف المعلم)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/mousa/Almusshaf-Al-Mo-lim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-243-243",
    "name": "Abdullah Al Moussâ (Mujawwad)",
    "nameAr": "عبدالله الموسى (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/mousa/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-244-244",
    "name": "Abdullah Al Khalaf (Mujawwad)",
    "nameAr": "عبدالله الخلف (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/khalf/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-245-245",
    "name": "Mansour As Sâlimî (Mujawwad)",
    "nameAr": "منصور السالمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/mansor/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-246-246",
    "name": "Salâh Musallî (Mujawwad)",
    "nameAr": "صلاح مصلي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server14.mp3quran.net/musali/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-247-247",
    "name": "Khâlid As Shârikh (Mujawwad)",
    "nameAr": "خالد الشارخ (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server14.mp3quran.net/sharekh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-248-248",
    "name": "Nâssir Al Usfûr (Mujawwad)",
    "nameAr": "ناصر العصفور (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/alosfor/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-25-25",
    "name": "Dawood Hamza (Mujawwad)",
    "nameAr": "داود حمزة (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/hamza/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-250-250",
    "name": "Muhammad Al Bakhît (Mujawwad)",
    "nameAr": "محمد البخيت (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/bukheet/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-251-251",
    "name": "Nasser Almajed (Mujawwad)",
    "nameAr": "ناصر الماجد (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server14.mp3quran.net/nasser_almajed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-252-252",
    "name": "Ahmad As Suwaylim (Mujawwad)",
    "nameAr": "أحمد السويلم (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/swlim/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-253-253",
    "name": "Islâm Subhî (Mujawwad)",
    "nameAr": "إسلام صبحي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-254-254",
    "name": "Badr At Turkî (Mujawwad)",
    "nameAr": "بدر التركي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server10.mp3quran.net/bader/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-255-255",
    "name": "Hitham Aljadani (Mujawwad)",
    "nameAr": "هيثم الجدعاني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/hitham/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-256-256",
    "name": "Ahmad Shaheen (Mujawwad)",
    "nameAr": "أحمد خليل شاهين (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/shaheen/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-257-257",
    "name": "Saad Almqren (Mujawwad)",
    "nameAr": "سعد المقرن (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/saad/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-259-259",
    "name": "Ahmad An-Nafis (Mujawwad)",
    "nameAr": "أحمد النفيس (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/nufais/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-26-26",
    "name": "Rasheed Ifrad (Warsh)",
    "nameAr": "رشيد إفراد (ورش عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/ifrad/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-260-260",
    "name": "Omar Al Darweez (Mujawwad)",
    "nameAr": "عمر الدريويز (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/darweez/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-263-263",
    "name": "Abdulaziz Alasiri (Mujawwad)",
    "nameAr": "عبدالعزيز العسيري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server16.mp3quran.net/abdulazizasiri/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-264-264",
    "name": "Younes Souilass' (Warsh)",
    "nameAr": "يونس اسويلص (ورش عن نافع - مرتل)",
    "country": "Koweït",
    "server": "https://server16.mp3quran.net/souilass/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-313",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (ابن جماز عن أبي جعفر - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Ibn-Jammaz-A-n-Abi-Ja-far/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-312",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (هشام عن ابي عامر - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Hesham-A-n-Abi-A-mer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-311",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (خلف عن حمزة - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Khalaf-A-n-Hamzah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-310",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (الدوري عن الكسائي - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-309",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (السوسي عن أبي عمرو - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Assosi-A-n-Abi-Amr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-308",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (ابن ذكوان عن ابن عامر - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Ibn-Thakwan-A-n-Ibn-Amer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-301",
    "name": "Ahmad Deban (Warsh)",
    "nameAr": "أحمد ديبان (ورش عن نافع من طريق الأزرق - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Alazraq/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-285",
    "name": "Ahmad Deban (Al-Duri)",
    "nameAr": "أحمد ديبان (الدوري عن أبي عمرو - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Aldori-A-n-Abi-Amr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-280",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-279",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (البزي عن ابن كثير - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Albizi-A-n-Ibn-Katheer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-278",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (قنبل عن ابن كثير - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Qunbol-A-n-Ibn-Katheer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-276",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (شعبة  عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Sho-bah-A-n-Asim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-265-265",
    "name": "Ahmad Deban (Mujawwad)",
    "nameAr": "أحمد ديبان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/deban/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-267-267",
    "name": "Abdullah Kamil (Mujawwad)",
    "nameAr": "عبدالله كامل (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server16.mp3quran.net/kamel/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-268-268",
    "name": "Peshawa Qadr Al-Kurdi (Mujawwad)",
    "nameAr": "بيشه وا قادر الكردي (حفص عن عاصم - مرتل)",
    "country": "Syrie",
    "server": "https://server16.mp3quran.net/peshawa/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-27-261",
    "name": "Rachid Belalya (Mujawwad)",
    "nameAr": "رشيد بلعالية (حفص عن عاصم - مرتل)",
    "country": "Maroc",
    "server": "https://server6.mp3quran.net/bl3/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-27-27",
    "name": "Rachid Belalya (Warsh)",
    "nameAr": "رشيد بلعالية (ورش عن نافع - مرتل)",
    "country": "Maroc",
    "server": "https://server6.mp3quran.net/bl3/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-271-271",
    "name": "Nezir El-Maliki (Mujawwad)",
    "nameAr": "نذير المالكي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net//nathier/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-272-296",
    "name": "Okasha Kameny (Mujawwad)",
    "nameAr": "عكاشة كميني (البزي عن ابن كثير - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/okasha/Rewayat-Albizi-A-n-Ibn-Katheer/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-272-272",
    "name": "Okasha Kameny (Mujawwad)",
    "nameAr": "عكاشة كميني (الدوري عن الكسائي - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/okasha/Rewayat-AlDorai-A-n-Al-Kisa-ai/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-273-273",
    "name": "Haitham Aldukhain (Hafs)",
    "nameAr": "هيثم الدخين (حفص عن عاصم - 4)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/h_dukhain/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-274-274",
    "name": "Muhammad Abu Sneina (Mujawwad)",
    "nameAr": "محمد أبو سنينة (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/sneineh/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-275-275",
    "name": "Mohammed Al-Amin Qeniwa (Mujawwad)",
    "nameAr": "محمد الأمين قنيوة (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/qeniwa/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-277-277",
    "name": "Mahmoud Abdul Hakam (Mujawwad)",
    "nameAr": "محمود عبدالحكم (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server16.mp3quran.net/m_abdelhakam/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-278-290",
    "name": "Ahmad Issa Al Maasaraawi (Mujawwad)",
    "nameAr": "أحمد عيسى المعصراوي (قراءة يعقوب الحضرمي بروايتي رويس وروح - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_maasaraawi/Rewayat-Rawh-A-n-Yakoob-Alhadrami/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-278-289",
    "name": "Ahmad Issa Al Maasaraawi (Mujawwad)",
    "nameAr": "أحمد عيسى المعصراوي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_maasaraawi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-279-291",
    "name": "Ibrahim Kshidan (Mujawwad)",
    "nameAr": "إبراهيم كشيدان (قالون عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/i_kshidan/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-28-28",
    "name": "Zakaria Hamama (Mujawwad)",
    "nameAr": "زكريا حمامة (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/zakariya/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-280-292",
    "name": "Hashim Abu Dalal (Mujawwad)",
    "nameAr": "هاشم أبو دلال (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/h_abudalal/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-281-293",
    "name": "Fouad Alkhamery (Mujawwad)",
    "nameAr": "فؤاد الخامري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/f_khamery/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-282-294",
    "name": "Sayed Ahmad Hashemi (Mujawwad)",
    "nameAr": "سيد أحمد هاشمي (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server16.mp3quran.net/s_hashemi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-283-295",
    "name": "Khalid Mohammadi (Mujawwad)",
    "nameAr": "خالد كريم محمدي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server16.mp3quran.net/kh_mohammadi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-284-297",
    "name": "Mal-Allah Abdulrhman Aljaber (Mujawwad)",
    "nameAr": "مال الله عبدالرحمن الجابر (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server16.mp3quran.net/mal-allah_jaber/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-285-298",
    "name": "Salman Alsadeiq (Mujawwad)",
    "nameAr": "سلمان الصديق (حفص عن عاصم - مرتل)",
    "country": "Soudan",
    "server": "https://server16.mp3quran.net/s_sadeiq/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-286-299",
    "name": "Hasan Saleh (Mujawwad)",
    "nameAr": "حسن صالح (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/h_saleh/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-287-302",
    "name": "Abdulrahman Alshahhat (Mujawwad)",
    "nameAr": "عبدالرحمن الشحات (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_alshahhat/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-288-303",
    "name": "Issa Omar Sanankoua (Mujawwad)",
    "nameAr": "عيسى عمر سناكو (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/i_sanankoua/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-289-304",
    "name": "Haroon Baqai (Mujawwad)",
    "nameAr": "هارون بقائي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/h_baqai/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-29-281",
    "name": "Abdullah Bukhari (Mujawwad)",
    "nameAr": "عبدالله بخاري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_bukhari/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-290-306",
    "name": "Saleh Alquraishi (Mujawwad)",
    "nameAr": "صالح القريشي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/s_alquraishi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-3-3",
    "name": "Ibrahime Al Assiri (Mujawwad)",
    "nameAr": "إبراهيم العسيري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/3siri/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-30-30",
    "name": "Saad El Ghamidi (Mujawwad)",
    "nameAr": "سعد الغامدي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server7.mp3quran.net/s_gmd/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-300-300",
    "name": "Saleh Alshamrani (Mujawwad)",
    "nameAr": "صالح الشمراني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/shamrani/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-301-307",
    "name": "Faisal Al-Hajry (Mujawwad)",
    "nameAr": "فيصل الهاجري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/f_hajry/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-302-314",
    "name": "Anas Alemadi (Mujawwad)",
    "nameAr": "أنس العمادي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_alemadi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-303-315",
    "name": "Abdulmalik Alaskar (Mujawwad)",
    "nameAr": "عبدالملك العسكر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_alaskar/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-304-316",
    "name": "Abdulkareem Alhazmi (Mujawwad)",
    "nameAr": "عبدالكريم الحازمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_alhazmi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-305-317",
    "name": "Hicham Lharraz (Warsh)",
    "nameAr": "هشام الهراز (ورش عن نافع - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/H-Lharraz/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-306-318",
    "name": "Abdullah Al-Mishal (Mujawwad)",
    "nameAr": "عبدالله المشعل (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a-almishal/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-307-319",
    "name": "Abdelaziz sheim (Warsh)",
    "nameAr": "عبدالعزيز سحيم (ورش عن نافع - مرتل)",
    "country": "Maroc",
    "server": "https://server16.mp3quran.net/a_sheim/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-31-31",
    "name": "Saoud Al Cherim (Mujawwad)",
    "nameAr": "سعود الشريم (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server7.mp3quran.net/shur/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-32-32",
    "name": "Sahl Yassine (Mujawwad)",
    "nameAr": "سهل ياسين (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/shl/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-33-33",
    "name": "Zaki Daghistani (Mujawwad)",
    "nameAr": "زكي داغستاني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/zaki/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-34-34",
    "name": "Sami Al Hassan (Mujawwad)",
    "nameAr": "سامي الحسن (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/sami_hsn/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-35-35",
    "name": "Sami Al-Dosari (Mujawwad)",
    "nameAr": "سامي الدوسري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/sami_dosr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-36-36",
    "name": "Sayeed Ramadan (Mujawwad)",
    "nameAr": "سيد رمضان (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server12.mp3quran.net/sayed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-37-37",
    "name": "Shaban Al-Sayiaad (Mujawwad)",
    "nameAr": "شعبان الصياد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/shaban/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-38-38",
    "name": "Shirazade Taher (Mujawwad)",
    "nameAr": "شيرزاد عبدالرحمن طاهر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/taher/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-39-39",
    "name": "Saber Abdulhakm (Mujawwad)",
    "nameAr": "صابر عبدالحكم (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/hkm/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-4-4",
    "name": "Shaik Aboubaker Al-Chateri (Mujawwad)",
    "nameAr": "شيخ أبو بكر الشاطري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/shatri/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-40-40",
    "name": "Saleh Alsahood (Mujawwad)",
    "nameAr": "صالح الصاهود (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/sahood/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-41-41",
    "name": "Saleh Al Taleb (Mujawwad)",
    "nameAr": "صالح آل طالب (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/tlb/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-42-42",
    "name": "Saleh Al Habdan (Mujawwad)",
    "nameAr": "صالح الهبدان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/habdan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-43-43",
    "name": "Salah Al Bedair (Mujawwad)",
    "nameAr": "صلاح البدير (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/s_bud/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-44-45",
    "name": "Salah Al-Hachem (Mujawwad)",
    "nameAr": "صلاح الهاشم (قالون عن نافع - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/salah_hashim_m/Rewayat-Qalon-A-n-Nafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-44-44",
    "name": "Salah Al-Hachem (Mujawwad)",
    "nameAr": "صلاح الهاشم (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server12.mp3quran.net/salah_hashim_m/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-46-46",
    "name": "Salah Boukhater (Mujawwad)",
    "nameAr": "صلاح بو خاطر (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/bu_khtr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-47-283",
    "name": "Mukhtar Al-Haj (Mujawwad)",
    "nameAr": "مختار الحاج (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/mukhtar_haj/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-48-48",
    "name": "Adel Ryyan (Mujawwad)",
    "nameAr": "عادل ريان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/ryan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-49-49",
    "name": "Abdelbari Al-Toubayti (Mujawwad)",
    "nameAr": "عبدالبارئ الثبيتي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/thubti/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-5-5",
    "name": "Ahmed El-Ajami (Mujawwad)",
    "nameAr": "أحمد بن علي العجمي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server10.mp3quran.net/ajm/",
    "apiId": "ar.ahmedajamy",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-50-169",
    "name": "Abdelbari Mohammad (Hafs)",
    "nameAr": "عبدالبارئ محمد (المصحف المعلم - المصحف المعلم)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/bari/Almusshaf-Al-Mo-lim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-50-50",
    "name": "Abdelbari Mohammad (Mujawwad)",
    "nameAr": "عبدالبارئ محمد (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/bari/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-51-53",
    "name": "Abdelbassit Abdelsamad (Mujawwad)",
    "nameAr": "عبدالباسط عبدالصمد (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server7.mp3quran.net/basit/",
    "apiId": "ar.abdulsamad",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-51-52",
    "name": "Abdelbassit Abdelsamad (Warsh)",
    "nameAr": "عبدالباسط عبدالصمد (ورش عن نافع - مرتل)",
    "country": "Égypte",
    "server": "https://server7.mp3quran.net/basit/Rewayat-Warsh-A-n-Nafi/",
    "apiId": "ar.abdulbasitmurattal",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-51-51",
    "name": "Abdelbassit Abdelsamad (Mujawwad)",
    "nameAr": "عبدالباسط عبدالصمد (المصحف المجود - المصحف المجود)",
    "country": "Égypte",
    "server": "https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/",
    "apiId": "ar.abdulsamad",
    "hasDirectApi": true
  },
  {
    "id": "mp3quran-54-54",
    "name": "Abderrahmane Soudais (Mujawwad)",
    "nameAr": "عبدالرحمن السديس (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/sds/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-55-55",
    "name": "Abdelaziz Al-Ahmad (Mujawwad)",
    "nameAr": "عبدالعزيز الأحمد (حفص عن عاصم - مرتل)",
    "country": "Maroc",
    "server": "https://server11.mp3quran.net/a_ahmed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-56-56",
    "name": "Abdelaziz Azzahrani (Mujawwad)",
    "nameAr": "عبدالعزيز الزهراني (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/zahrani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-57-57",
    "name": "Abdellah Al-Bourimi (Mujawwad)",
    "nameAr": "عبدالله البريمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/brmi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-58-58",
    "name": "Abdullah Albuajan (Mujawwad)",
    "nameAr": "عبدالله البعيجان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/buajan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-59-59",
    "name": "Abdellah Al-Matroud (Mujawwad)",
    "nameAr": "عبدالله المطرود (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/mtrod/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-6-6",
    "name": "Ahmed El-hawachi (Mujawwad)",
    "nameAr": "أحمد الحواشي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/hawashi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-60-60",
    "name": "Abdellah Basfer (Mujawwad)",
    "nameAr": "عبدالله بصفر (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server6.mp3quran.net/bsfr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-61-61",
    "name": "Abdellah khayatt (Mujawwad)",
    "nameAr": "عبدالله خياط (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/kyat/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-62-62",
    "name": "Abdellah Al-Johany (Mujawwad)",
    "nameAr": "عبدالله عواد الجهني (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server13.mp3quran.net/jhn/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-63-63",
    "name": "Abdullah Qaulan (Mujawwad)",
    "nameAr": "عبدالله غيلان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/gulan/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-64-258",
    "name": "Abderrashed Sofy (Mujawwad)",
    "nameAr": "عبدالرشيد صوفي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/soufi/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-64-65",
    "name": "Abderrashed Sofy (Mujawwad)",
    "nameAr": "عبدالرشيد صوفي (السوسي عن أبي عمرو - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/soufi/Rewayat-Assosi-A-n-Abi-Amr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-64-64",
    "name": "Abderrashed Sofy (Mujawwad)",
    "nameAr": "عبدالرشيد صوفي (خلف عن حمزة - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/soufi/Rewayat-Khalaf-A-n-Hamzah/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-66-66",
    "name": "Abdelmohsen Al-Harty (Mujawwad)",
    "nameAr": "عبدالمحسن الحارثي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/mohsin_harthi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-67-67",
    "name": "Abdulmohsen Al-Qasim (Mujawwad)",
    "nameAr": "عبدالمحسن القاسم (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/qasm/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-68-68",
    "name": "Abdelmohsen Al-Askar (Mujawwad)",
    "nameAr": "عبدالمحسن العسكر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/askr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-69-69",
    "name": "Abdulmohsin Al-Obaikan (Mujawwad)",
    "nameAr": "عبدالمحسن العبيكان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/obk/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-7-7",
    "name": "Ahmad Saud (Mujawwad)",
    "nameAr": "أحمد سعود (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/saud/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-70-70",
    "name": "Coran,Audio,Library,MP3,Coran,Omar,Al,Darweez (Mujawwad)",
    "nameAr": "عبدالهادي أحمد كناكري (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/kanakeri/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-71-71",
    "name": "Abdelwadoud Hanife (Mujawwad)",
    "nameAr": "عبدالودود حنيف (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/wdod/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-72-72",
    "name": "Abdelwali Al-Arkani (Mujawwad)",
    "nameAr": "عبدالولي الأركاني (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/arkani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-73-73",
    "name": "Ali Abou Hachem (Mujawwad)",
    "nameAr": "علي أبو هاشم (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/abo_hashim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-74-305",
    "name": "Ali Al-Houdayfi (Mujawwad)",
    "nameAr": "علي بن عبدالرحمن الحذيفي (شعبة  عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/hthfi/Rewayat-Sho-bah-A-n-Asim/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-74-75",
    "name": "Ali Al-Houdayfi (Mujawwad)",
    "nameAr": "علي بن عبدالرحمن الحذيفي (قالون عن نافع - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/huthifi_qalon/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-74-74",
    "name": "Ali Al-Houdayfi (Mujawwad)",
    "nameAr": "علي بن عبدالرحمن الحذيفي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/hthfi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-76-76",
    "name": "Ali Jabber (Mujawwad)",
    "nameAr": "علي جابر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server11.mp3quran.net/a_jbr/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-77-77",
    "name": "Ali Hajjaj Alsouasi (Mujawwad)",
    "nameAr": "علي حجاج السويسي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/hajjaj/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-78-78",
    "name": "Imad Zouhaire Hafed (Mujawwad)",
    "nameAr": "عماد زهير حافظ (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/hafz/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-79-282",
    "name": "Abdulaziz Alturki (Mujawwad)",
    "nameAr": "عبدالعزيز التركي (حفص عن عاصم - مرتل)",
    "country": "Maroc",
    "server": "https://server16.mp3quran.net/a_turki/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-8-8",
    "name": "Ahmed Saber (Mujawwad)",
    "nameAr": "أحمد صابر (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/saber/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-80-80",
    "name": "Omar Al Kazabri (Warsh)",
    "nameAr": "عمر القزابري (ورش عن نافع - مرتل)",
    "country": "Maroc",
    "server": "https://server9.mp3quran.net/omar_warsh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-81-81",
    "name": "Faress Abbad (Mujawwad)",
    "nameAr": "فارس عباد (حفص عن عاصم - مرتل)",
    "country": "Yémen",
    "server": "https://server8.mp3quran.net/frs_a/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-82-82",
    "name": "Fahd Al Outaibi (Mujawwad)",
    "nameAr": "فهد العتيبي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/fahad_otibi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-83-83",
    "name": "Fahd Al Kandari (Mujawwad)",
    "nameAr": "فهد الكندري (حفص عن عاصم - مرتل)",
    "country": "Koweït",
    "server": "https://server11.mp3quran.net/kndri/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-84-84",
    "name": "Fawaz Alkabi (Mujawwad)",
    "nameAr": "فواز الكعبي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/fawaz/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-85-85",
    "name": "Lafi Al Ouni (Mujawwad)",
    "nameAr": "لافي العوني (حفص عن عاصم - مرتل)",
    "country": "Koweït",
    "server": "https://server6.mp3quran.net/lafi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-86-86",
    "name": "Naser Al Qattami (Mujawwad)",
    "nameAr": "ناصر القطامي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/qtm/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-87-87",
    "name": "Nabil Al Rifay (Mujawwad)",
    "nameAr": "نبيل الرفاعي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server9.mp3quran.net/nabil/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-88-88",
    "name": "Neamah Al-Hassan (Mujawwad)",
    "nameAr": "نعمة الحسان (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/namh/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-89-89",
    "name": "Hani Arrefay (Mujawwad)",
    "nameAr": "هاني الرفاعي (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/hani/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-9-9",
    "name": "Ahmad Nauina (Mujawwad)",
    "nameAr": "أحمد نعينع (حفص عن عاصم - مرتل)",
    "country": "Égypte",
    "server": "https://server11.mp3quran.net/ahmad_nu/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-90-90",
    "name": "Walid Al Doulaimi (Mujawwad)",
    "nameAr": "وليد الدليمي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/dlami/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-91-91",
    "name": "Waleed Alnaehi (Mujawwad)",
    "nameAr": "وليد النائحي (قالون عن نافع من طريق أبي نشيط - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/waleed/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-92-92",
    "name": "Yasser Al Doussari (Mujawwad)",
    "nameAr": "ياسر الدوسري (حفص عن عاصم - مرتل)",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/yasser/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-93-93",
    "name": "Yasser Al-Qurashi (Mujawwad)",
    "nameAr": "ياسر القرشي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/qurashi/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-94-94",
    "name": "Yasser Al-Faylakawi (Mujawwad)",
    "nameAr": "ياسر الفيلكاوي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server6.mp3quran.net/fyl/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-95-95",
    "name": "Yasser Al-Mazroyee (Mujawwad)",
    "nameAr": "ياسر المزروعي  (قراءة يعقوب الحضرمي بروايتي رويس وروح - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/mzroyee/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-96-96",
    "name": "Yahya Hawwa (Mujawwad)",
    "nameAr": "يحيى حوا (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server12.mp3quran.net/yahya/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-97-97",
    "name": "Yousef Alshoaey (Mujawwad)",
    "nameAr": "يوسف الشويعي (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server9.mp3quran.net/yousef/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "mp3quran-98-284",
    "name": "Abdullah Abdal (Mujawwad)",
    "nameAr": "عبدالله عبدل (حفص عن عاصم - مرتل)",
    "country": "Autres Pays",
    "server": "https://server16.mp3quran.net/a_abdl/Rewayat-Hafs-A-n-Assem/",
    "apiId": "ar.alafasy",
    "hasDirectApi": false
  },
  {
    "id": "cloud-ar.abdulbasitmurattal",
    "name": "Abdul Basit",
    "nameAr": "عبد الباسط عبد الصمد المرتل",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.abdulbasitmurattal",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.abdullahbasfar",
    "name": "Abdullah Basfar",
    "nameAr": "عبد الله بصفر",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.abdullahbasfar",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.abdurrahmaansudais",
    "name": "Abdurrahmaan As-Sudais",
    "nameAr": "عبدالرحمن السديس",
    "country": "Arabie Saoudite",
    "server": "https://server11.mp3quran.net/sds/",
    "apiId": "ar.abdurrahmaansudais",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.abdulsamad",
    "name": "Abdul Samad",
    "nameAr": "عبدالباسط عبدالصمد",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.abdulsamad",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.shaatree",
    "name": "Abu Bakr Ash-Shaatree",
    "nameAr": "أبو بكر الشاطري",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.shaatree",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.ahmedajamy",
    "name": "Ahmed ibn Ali al-Ajamy",
    "nameAr": "أحمد بن علي العجمي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.ahmedajamy",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.alafasy",
    "name": "Alafasy",
    "nameAr": "مشاري العفاسي",
    "country": "Koweït",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.alafasy",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.hanirifai",
    "name": "Hani Rifai",
    "nameAr": "هاني الرفاعي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.hanirifai",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.husary",
    "name": "Husary",
    "nameAr": "محمود خليل الحصري",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.husary",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.husarymujawwad",
    "name": "Husary (Mujawwad)",
    "nameAr": "محمود خليل الحصري (المجود)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.husarymujawwad",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.hudhaify",
    "name": "Hudhaify",
    "nameAr": "علي بن عبدالرحمن الحذيفي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.hudhaify",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.ibrahimakhbar",
    "name": "Ibrahim Akhdar",
    "nameAr": "إبراهيم الأخضر",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.ibrahimakhbar",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.mahermuaiqly",
    "name": "Maher Al Muaiqly",
    "nameAr": "ماهر المعيقلي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.mahermuaiqly",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.minshawi",
    "name": "Minshawi",
    "nameAr": "محمد صديق المنشاوي",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.minshawi",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.minshawimujawwad",
    "name": "Minshawy (Mujawwad)",
    "nameAr": "محمد صديق المنشاوي (المجود)",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.minshawimujawwad",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.muhammadayyoub",
    "name": "Muhammad Ayyoub",
    "nameAr": "محمد أيوب",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.muhammadayyoub",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.muhammadjibreel",
    "name": "Muhammad Jibreel",
    "nameAr": "محمد جبريل",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.muhammadjibreel",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.saoodshuraym",
    "name": "Saood bin Ibraaheem Ash-Shuraym",
    "nameAr": "سعود الشريم",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.saoodshuraym",
    "hasDirectApi": true
  },
  {
    "id": "cloud-en.walk",
    "name": "Ibrahim Walk (English Translation)",
    "nameAr": "Ibrahim Walk",
    "country": "Royaume-Uni",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "en.walk",
    "hasDirectApi": true
  },
  {
    "id": "cloud-fa.hedayatfarfooladvand",
    "name": "Fooladvand - Hedayatfar",
    "nameAr": "Fooladvand - Hedayatfar",
    "country": "Iran",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "fa.hedayatfarfooladvand",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.parhizgar",
    "name": "Parhizgar",
    "nameAr": "شهریار پرهیزگار",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.parhizgar",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ur.khan",
    "name": "Shamshad Ali Khan (Urdu)",
    "nameAr": "Shamshad Ali Khan",
    "country": "Pakistan",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ur.khan",
    "hasDirectApi": true
  },
  {
    "id": "cloud-zh.chinese",
    "name": "Chinese (Chinese)",
    "nameAr": "中文",
    "country": "Chine",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "zh.chinese",
    "hasDirectApi": true
  },
  {
    "id": "cloud-fr.leclerc",
    "name": "Youssouf Leclerc (Traduction Française)",
    "nameAr": "Youssouf Leclerc",
    "country": "France",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "fr.leclerc",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.aymanswoaid",
    "name": "Ayman Sowaid",
    "nameAr": "أيمن سويد",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.aymanswoaid",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ru.kuliev-audio",
    "name": "Elmir Kuliev by 1MuslimApp",
    "nameAr": "Elmir Kuliev by 1MuslimApp",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ru.kuliev-audio",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ru.kuliev-audio-2",
    "name": "Elmir Kuliev 2 by 1MuslimApp",
    "nameAr": "Elmir Kuliev 2 by 1MuslimApp",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ru.kuliev-audio-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-kk.khalifahaltai-audio",
    "name": "Kazakh Translation Audio by Khalifah Altai",
    "nameAr": "Қазақ - Халифа Алтайдың",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "kk.khalifahaltai-audio",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.alafasy-2",
    "name": "Alafasy",
    "nameAr": "مشاري العفاسي",
    "country": "Koweït",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.alafasy-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.husary-2",
    "name": "Husary",
    "nameAr": "محمود خليل الحصري",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.husary-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.mahermuaiqly-2",
    "name": "Maher Al Muaiqly",
    "nameAr": "ماهر المعيقلي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.mahermuaiqly-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.hudhaify-2",
    "name": "Hudhaify",
    "nameAr": "علي بن عبدالرحمن الحذيفي",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.hudhaify-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.husarymujawwad-2",
    "name": "Husary (Mujawwad)",
    "nameAr": "محمود خليل الحصري (المجود)",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.husarymujawwad-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.minshawi-2",
    "name": "Minshawi",
    "nameAr": "محمد صديق المنشاوي",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.minshawi-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.muhammadayyoub-2",
    "name": "Muhammad Ayyoub",
    "nameAr": "محمد أيوب",
    "country": "Arabie Saoudite",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.muhammadayyoub-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-ar.muhammadjibreel-2",
    "name": "Muhammad Jibreel",
    "nameAr": "محمد جبريل",
    "country": "Égypte",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "ar.muhammadjibreel-2",
    "hasDirectApi": true
  },
  {
    "id": "cloud-tr.vakfi-audio",
    "name": "Diyanet Vakfı",
    "nameAr": "Diyanet Vakfı",
    "country": "Autres Pays",
    "server": "https://server8.mp3quran.net/afs/",
    "apiId": "tr.vakfi-audio",
    "hasDirectApi": true
  }
];
