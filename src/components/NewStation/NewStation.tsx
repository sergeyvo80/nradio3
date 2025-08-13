import { useForm } from 'react-hook-form';
import styles from './NewStation.module.scss';
import NewStationInterface from '@/types/NewStationInterface';
import { useState } from 'react';

interface Props {
  onNewStationAdd: (data: NewStationInterface) => void;
}


const NewStation = ({ onNewStationAdd }: Props) => {
  const [ isSent, setIsSent ] = useState<boolean>(false)
  const { register, handleSubmit, formState: { errors } } = useForm<NewStationInterface>({
    defaultValues: {
      title: 'test1',
      stream: 'test2',
    },
  });

  const onSubmit = handleSubmit((data: NewStationInterface) => {
    console.log('>>> handleSubmit', data);
    setIsSent(true);
    onNewStationAdd(data);
  });

  return (
    <div className={styles.NewStation}>
      {!isSent && (
        <form  className={styles.form}>      
          <div>
            <div>Название</div>
            <input {...register('title', { required: true })} className={styles.input} />
            {errors.title && <span>Обязательное поле</span>}
          </div>
          <div>
            <div>Ссылка на стрим</div>
            <input {...register('stream', { required: true })} className={styles.input} />
            {errors.stream && <span>Обязательное поле</span>}
          </div>
          <button onClick={onSubmit} className={styles.button}>Добавить</button>
        </form>
      )}
      {isSent && (
        <>
          <p className={styles.p}>Станция добавлена локально и отправлена на сервер для модерации.</p>
          <p className={styles.p}>После подтверждения станция будет доступна у всех пользователей.</p>
        </>
      )}
    </div>
  );
};

NewStation.displayName = 'NewStation';

export default NewStation;
