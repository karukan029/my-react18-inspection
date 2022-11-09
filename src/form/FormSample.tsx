import { FC } from 'react'
import VanillaForm from './components/VanillaForm'
import RHFForm from './components/RHFForm'

const FormSample: FC = () => {
  return (
    <>
      <h1>FormSample</h1>
      <div>
        <h2>vanilla</h2>
        <VanillaForm></VanillaForm>
      </div>
      <div>
        <h2>React Hook Form</h2>
        <RHFForm></RHFForm>
      </div>
    </>
  )
}

export default FormSample