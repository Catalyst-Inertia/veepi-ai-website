// TODO: Change `Example` to your model name and change `User` with your model Name

import { GeneralOmitModel } from './general-omit'

export interface ExampleDataModel {
  id: string
}

export interface ExamplePayloadCreateModel {
  name: string
}

export interface ExamplePayloadUpdateModel {
  name: string
}

export interface ExampleFormModel
  extends Omit<ExampleDataModel, GeneralOmitModel> {
  name: string
}
