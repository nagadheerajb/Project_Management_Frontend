interface ErrorMessageProps {
  message?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) =>
  message ? <div className="text-red-500 text-sm text-center mb-4">{message}</div> : null

export default ErrorMessage
