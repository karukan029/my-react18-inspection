import { FC, useState, ChangeEvent, SyntheticEvent } from 'react'
import { Box, Button, ButtonGroup, Checkbox, FormLabel, Input, Select } from '@chakra-ui/react'

const genderCode = {f: '女性', m: '男性', n: 'それ以外'} as const

interface FormData {
  username: string;
  zipcode?: string;
  gender?: keyof typeof genderCode;
  isAgreed: boolean;
}

const VanillaForm: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    isAgreed: false,
  })

  const handleSubmit = (event: SyntheticEvent) => {
    /**
     * JavaScript本来のイベントの動作を阻止している
     * 今回はsubmitしたときに、現在のURLにフォームの値がPOSTで送信され画面遷移するのを防いでいる
     */
    event.preventDefault()
    console.log(formData)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target
    const value = event.target.type === 'checkbox'
      ? (event.target as HTMLInputElement).checked
      : event.target.value

    setFormData((state) => ({ ...state, [name]: value }))
  }

  const handleReset = (event: SyntheticEvent) => {
    /**
     * バブリングを防止
     */
    event.stopPropagation()

    setFormData({
      username: '',
      isAgreed: false,
    })
  }

  return(
    <Box p={5} w="md" borderWidth="1px" borderRadius="1g" boxShadow="base">
      <form onSubmit={handleSubmit}>
        <FormLabel htmlFor='username'>
          ユーザー名
        </FormLabel>
        <Input name="username" size="md" value={formData.username} onChange={handleChange} />
        <FormLabel htmlFor='zipcode'>
          郵便番号
        </FormLabel>
        <Input name="zipcode" size="md" value={formData.zipcode} onChange={handleChange} />
        <Select name="gender" my={6} placeholder="性別を選択…" value={formData.gender} onChange={handleChange}>
          {Object.entries(genderCode).map(([code, name]) => (
            <option value={code} key={code}>
              { name }
            </option>
          ))}
        </Select>
        <Checkbox name='isAgreed' isChecked={formData.isAgreed} onChange={handleChange}>
          規約に同意する
        </Checkbox>
        <ButtonGroup my={3} w="xs">
          <Button w="30%" colorScheme="orange" variant="solid" type="reset" onClick={handleReset}>
            リセット
          </Button>
          <Button w="70%" colorScheme="blue" variant="solid" type="submit">
            送信
          </Button>
        </ButtonGroup>
      </form>
    </Box>
  )
}

export default VanillaForm