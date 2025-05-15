// src/components/services/ServiceList.tsx
import { useEffect, useState } from 'react';
import { getAllServices } from '../../api/serviceApi';
import { Link } from 'react-router-dom';

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getAllServices().then(res => setServices(res.data));
  }, []);

  return (
    <div>
      <h2>Доступні послуги</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {services.map((service: any) => (
          <div
            key={service.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              width: '250px',
              textAlign: 'center'
            }}
          >
            <Link to={`/services/${service.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={`http://localhost:5000/${service.imagePath}`}
                alt={service.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h3>{service.title}</h3>
              <p style={{ fontWeight: 'bold' }}>${service.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;