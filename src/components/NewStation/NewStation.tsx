import { useForm } from 'react-hook-form';
import styles from './NewStation.module.scss';
import NewStationInterface from '@/types/NewStationInterface';

interface Props {
  onNewStationAdd: (data: NewStationInterface) => void;
}


const NewStation = ({ onNewStationAdd }: Props) => {
  const { register, handleSubmit, formState: { errors } } = useForm<NewStationInterface>({
    defaultValues: {
      title: '',
      stream: '',
    },
  });

  const onSubmit = handleSubmit((data: NewStationInterface) => {
console.log('>>> handleSubmit', data);
    onNewStationAdd(data);
  });

  return (
    <div className={styles.NewStation}>
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
    </div>
  );
};

NewStation.displayName = 'NewStation';

export default NewStation;
