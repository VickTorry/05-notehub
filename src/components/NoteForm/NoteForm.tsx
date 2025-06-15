import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage, } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import type { NoteFormValues } from "../../types/note";


interface NoteFormProps {
  onSubmit: (note: NoteFormValues) => void;
  onCancel: () => void;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content is too long"),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required("Tag is required"),
});


export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) => {
    onSubmit(values);
    actions.resetForm();
  };


  return (
    <Formik initialValues={initialValues} validationSchema={OrderFormSchema} onSubmit={handleSubmit}>
    <Form className={css.form}>
  <div className={css.formGroup}>
    <label htmlFor="title">Title</label>
    <Field id="title" type="text" name="title" className={css.input} />
    <ErrorMessage name="title" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="content">Content</label>
    <Field
      as="textarea"
      id="content"
      name="content"
      rows="8"
      className={css.textarea}
    />
    <ErrorMessage name="content" className={css.error} />
  </div>

  <div className={css.formGroup}>
    <label htmlFor="tag">Tag</label>
    <Field as="select" id="tag" name="tag" className={css.select}>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </Field>
    <ErrorMessage name="tag" className={css.error} />
  </div>

  <div className={css.actions}>
  <button type="button" className={css.cancelButton} onClick={onCancel}>
      Cancel
  </button>
    <button
      type="submit"
      className={css.submitButton}
    >
      Create note
    </button>
  </div>
</Form>
  </Formik>

  );
}
