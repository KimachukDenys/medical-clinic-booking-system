import React from 'react';
import { Link } from 'react-router-dom';

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photoUrl: string;
  profile?: {
    education: string;
    experience: string;
    bio: string;
    specialization: string;
    price: number;
    rating: number | null;
  };
}

interface DoctorsListFormProps {
  doctors: Doctor[];
}

const DoctorsListForm: React.FC<DoctorsListFormProps> = ({ doctors }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6 2xl:gap-8 justify-items-center">
      {doctors
        .filter((doctor) => doctor.profile)
        .map((doctor) => (
          <div
            key={doctor.id}
            className="max-w-[500px] md:max-w-[520px] xl:max-w-[500px] 2xl:max-w-[745px] 
                      h-auto md:min-h-[370px] xl:min-h-[400px] 2xl:min-h-[520px] 
                      bg-white rounded-xl border-2 border-primary shadow-xl 
                      p-4 lg:p-5 2xl:p-6 flex flex-col justify-between"
          >
            {/* Top Section */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                {doctor.photoUrl ? (
                  <img
                    src={
                      doctor.photoUrl.startsWith('http')
                        ? doctor.photoUrl
                        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${doctor.photoUrl}`
                    }
                    alt={`${doctor.firstName} ${doctor.lastName}`}
                    className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[140px] lg:h-[140px] 2xl:w-[220px] 2xl:h-[220px] rounded-full border-2 border-primary object-cover"
                  />
                ) : (
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-semibold">
                    Немає фото
                  </div>
                )}
                <div className="mt-3 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-accent text-[16px] lg:text-[20px]  2xl:text-[25px] ${
                        i < (doctor.profile?.rating || 0) ? '' : 'opacity-30'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 ml-0 xl:ml-4">
                <h2 className="text-[15px] lg:text-[20px] 2xl:text-[24px] font-bold text-primary">
                  {doctor.firstName} {doctor.lastName}
                </h2>
                <p className="text-[15px] lg:text-[19px]  2xl:text-[24px] text-primary font-bold mt-2 xl:mt-3">
                  {doctor.profile?.specialization}
                </p>
                <div className="w-full lg:max-w-[330px] 2xl:max-w-[410px] h-[2px] bg-primary mt-2 2xl:mt-3 mb-4 2xl:mb-6 rounded-xl"></div>
                <p className="text-[11px]  lg:text-[14px] xl:text-[16px] font-inter font-medium text-primary">
                  {doctor.profile?.bio}, {doctor.profile?.experience}
                </p>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-primary text-background rounded-xl p-4 lg:p-5 mt-4">
              <div className="flex justify-between items-center">
                <div className="font-roboto font-bold text-base lg:text-lg tracking-[1px]">
                  Андрій Ковальчук
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-[16px] lg:text-[20px] 2xl:text-[25px]">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="font-playfair italic font-light text-[12px] lg:text-[14px] 2xl:text-base mt-2">
                Відгук від користувача, який може бути на 2–3 рядки. Можна скоротити або зробити кнопку
                &quot;читати більше&quot;.
              </p>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-4">
              <p className="text-primary text-[22px] lg:text-[22px] 2xl:text-[26px] font-semibold">
                Від: {doctor.profile?.price} грн
              </p>
              <Link
                to={`/doctors/${doctor.id}`}
                className="bg-primary w-full lg:w-[140px] 2xl:w-[225px] h-[50px] lg:h-[45px] 2xl:h-[60px] hover:bg-blue-800 transition text-background font-roboto font-bold text-[16px] lg:text-[18px] 2xl:text-[28px] rounded-lg flex items-center justify-center"
              >
                Записатися
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DoctorsListForm;
