import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <section className='profile'>
      <h2 className='layout__title-with-icon'>
        <User size={22} /> Profil utilisateur
      </h2>
      <ul>
        <li>
          <strong>Nom :</strong> John Doe
        </li>
        <li>
          <strong>Email :</strong> john.doe@example.com
        </li>
        <li>
          <strong>Rôle :</strong> Administrateur
        </li>
        <li>
          <strong>Date d'inscription :</strong> 01/01/2023
        </li>
      </ul>
    </section>
  );
}
