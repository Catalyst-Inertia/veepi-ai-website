import { useFeedbackDialogStore } from './feedback-dialog'

type notificationProps = {
  type: 'success' | 'error'
  entity: string
  action: string
}
export const useMainNotification = () => {
  const openDialog = useFeedbackDialogStore((s) => s.open)

  const showNotification = ({ type, entity, action }: notificationProps) => {
    const generalNotification = {
      success: {
        message: 'Success!',
        description: `Congratulations! ${entity.toLowerCase()} has been successfully ${action.toLowerCase()}!`,
      },
      error: {
        message: 'Error!',
        description: `Oops! Something went wrong with ${entity.toLowerCase()}. Unable to ${action.toLowerCase()} at this time. Please try again later or contact support if the issue persists`,
      },
    }

    return openDialog(
      type,
      generalNotification[type].message,
      generalNotification[type].description,
    )
  }

  return showNotification
}
