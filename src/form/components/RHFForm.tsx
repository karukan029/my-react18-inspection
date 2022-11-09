import { FC, SyntheticEvent } from 'react'
import { Box, Button, ButtonGroup, Checkbox, FormLabel, Input, Select } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

// バリデーションスキーマライブラリ
// yup
// import * as yup from 'yup'
// import type { InferType } from 'yup'
// import { yupResolver } from '@hookform/resolvers/yup'

// zod
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod'

const genderCode = {f: '女性', m: '男性', n: 'それ以外'} as const

// interface FormData {
//   username: string;
//   zipcode?: string;
//   gender?: keyof typeof genderCode;
//   isAgreed: boolean;
// }

// Zod用
interface FormData {
  username: string;
  zipcode?: string;
  gender?: keyof typeof genderCode;
  isAgreed: boolean;
}

// 正規表現でのマッチも可能なら、大体のケースは対応できそうな感じ
// yupはデフォルトは任意のはずだが、matchesすると7けた数字以外引っかかる
// genderがanyになる
// \dはすべての数字
// const formSchema = yup.object({
//   username: yup.string().required('必須項目です'),
//   zipcode: yup.string().max(7).matches(/\d{7}/, '7桁の数字で入力してください'),
//   gender: yup.mixed().oneOf(Object.keys(genderCode), '性別を選択してください'),
//   isAgreed: yup.boolean().oneOf([true], '同意が必要です').required()
// })

// type FormSchemaType = InferType<typeof formSchema>

// 型はZod特有のものとして全て定義される
const formSchema = zod.object({
    username: zod.string().min(1, '必須項目です'),
    zipcode: zod.optional(
      zod.string().max(7).regex(/\d{7}/, '7桁の数字で入力してください')
    ),
    gender: zod.optional(
      // 型定義が少し気持ち悪くなる()
      // オブジェクト型で扱うとこうするしかないっぽい
      // zod.nativeEnum(genderCode)
      zod.enum(Object.keys(genderCode) as never)
    ),
    isAgreed: zod.boolean().refine((val) => val, '同意が必要です'),
})

type FormSchemaType = zod.infer<typeof formSchema>
const RHFForm: FC = () => {
  // defaulValueは自動で補完されている(未設定のものには、空文字が設定される)
  // const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
  //   defaultValues: {
  //     username: '',
  //     isAgreed: false,
  //   }
  // })
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormSchemaType>({
    defaultValues: {
      username: '',
      isAgreed: false,
    },
    // resolver: yupResolver(formSchema),
    resolver: zodResolver(formSchema)
  })

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data)
  
  const onReset = (e: SyntheticEvent) => {
    e.stopPropagation()
    reset()
  }

  return(
    <Box p={5} w="md" borderWidth="1px" borderRadius="1g" boxShadow="base">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel htmlFor='username'>
          ユーザー名
        </FormLabel>
        <Input size="md" {...register('username')} />
        <p>{errors.username?.message}</p>
        <FormLabel htmlFor='zipcode'>
          郵便番号
        </FormLabel>
        <Input size="md" {...register('zipcode')} />
        {/* <input  {...register('zipcode')} /> */}
        <p>{errors.zipcode?.message}</p>
        <Select my={6} placeholder="性別を選択…" {...register('gender')}>
          {Object.entries(genderCode).map(([code, name]) => (
            <option value={code} key={code}>
              { name }
            </option>
          ))}
        </Select>
        {/* yup: 型エラーになるがメッセージが出る!? */}
        {/* <p>{errors.gender?.message}</p> */}
        {/* メッセージを指定していないものは、型補完でエラーが発生するのでわかる */}
        {/* <p>{errors.gender?.message}</p> */}
        <Checkbox {...register('isAgreed')}>
          規約に同意する
        </Checkbox>
        <p>{errors.isAgreed?.message}</p>
        <ButtonGroup my={3} w="xs">
          <Button w="30%" colorScheme="orange" variant="solid" type="reset" onClick={onReset}>
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

export default RHFForm