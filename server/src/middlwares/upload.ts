import multer from 'multer';
import path from 'path';

// Налаштування зберігання файлів за допомогою multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); // Зберігаємо файли в папці images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Генеруємо унікальне ім'я для файлу
  }
});

const upload = multer({ storage });

// Middleware для обробки одного файлу (з полем 'image')
export const uploadImage = upload.single('image');
