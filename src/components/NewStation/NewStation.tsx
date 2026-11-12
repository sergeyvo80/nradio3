import React from 'react';
import { useForm } from 'react-hook-form';

import NewStationInterface from '@/types/NewStationInterface';
import useLang from '@/hooks/useLang';

import styles from './NewStation.module.scss';

interface Props {
  onNewStationAdd: (data: NewStationInterface) => void;
  isSent?: boolean;
  onOkButton: () => void;
}

const NewStation = ({ onNewStationAdd, isSent, onOkButton }: Props) => {
  const { t } = useLang();

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
    <div className={`${styles.NewStation} NewStation`}>
      {!isSent && (
        <form className={styles.form}>
          <div>
            <div>{t('name')}</div>
            <input {...register('title', { required: true })} className={styles.input} />
            {errors.title && <span>{t('required')}</span>}
          </div>
          <div>
            <div>{t('streamUrl')}</div>
            <input {...register('stream', { required: true })} className={styles.input} />
            {errors.stream && <span>{t('required')}</span>}
          </div>
          <button onClick={onSubmit} className={`${styles.button} addButton`}>{t('add')}</button>
        </form>
      )}
      {isSent && (
        <>
          <p className={styles.p}>{t('sentLocal')}</p>
          <p className={styles.p}>{t('sentApproved')}</p>
          <button className={`${styles.button} okButton`} onClick={onOkButton}>Ok</button>
        </>
      )}
    </div>
  );
};

NewStation.displayName = 'NewStation';

export default NewStation;
