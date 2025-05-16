// src/app.ts
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/userRoutes'; 
import { errorHandler } from './middlwares/errorHandler'; 
import protectedRoutes from './routes/protectedRoutes';
import serviceRoutes from './routes/serviceRoutes'; 
import reviewRoutes from './routes/reviewRoutes';
import categoryRoutes from './routes/categoryRoutes';
import path from 'path';



const app = express();


// Мідлвари
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/protected', protectedRoutes);

// Налаштування для доступу до папки images
app.use('/images', express.static(path.join(__dirname, '../images')));

// Роутер
app.use('/api/users', userRoutes); 
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes); 
app.use('/api/reviews', reviewRoutes)


// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
