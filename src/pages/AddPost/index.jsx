import React, {useRef} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth)
  const [imageUrl, setImageUrl] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const inputFileRef = useRef(null)

    const isEditing = Boolean(id)

  const handleChangeFile = async (event) => {
      try {
          const formData = new FormData()
          const file = event.target.files[0]
          formData.append('image', file)
          const {data} = await axios.post('/uploads', formData)
          setImageUrl(data.url)
      } catch (e) {
          console.warn(e)
          alert('Ошибка при загрузке')
      }
  };

  const onClickRemoveImage =  () => {
      setImageUrl('')
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

    React.useEffect(() => {
        if (id) {
            axios.get(`/posts/${id}`).then(({data}) => {
                setTitle(data.title)
                setText(data.text)
                setTags(data.tags.join(','))
                setImageUrl(data.imageUrl)
            }).catch(e => {
                console.warn(e)
            })
        }
    }, [])

  if (!window.localStorage.getItem('token') && !isAuth) {
      return <Navigate to='/'/>
  }

  const onSubmit = async () => {
      try {
          setLoading(true)
          const fields = {
              title,
              imageUrl,
              tags: tags.split(','),
              text

          }
          const {data} = isEditing
            ? await axios.patch(`/posts/${id}`, fields)
            : await axios.post('/posts', fields)


          const _id = isEditing ? id : data._id;
          navigate(`/posts/${_id}`)
      } catch (e) {
          console.warn(e)
          alert("Ошибка при создании статьи")
      }
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()}  variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
          <>
              <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                  Удалить
              </Button>
              <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
          </>
      )}
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={event => setTitle( event.target.value)}
      />
      <TextField classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth
                 value={tags}
                 onChange={event => setTags( event.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? 'Редактировать' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
