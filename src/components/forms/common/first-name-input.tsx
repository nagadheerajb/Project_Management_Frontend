interface FirstNameInputProps {
  firstName: string
  setFirstName: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean // Add the disabled prop
}

const FirstNameInput: React.FC<FirstNameInputProps> = ({ firstName, setFirstName, disabled }) => (
  <div className="space-y-2">
    <label htmlFor="firstName" className="text-sm font-medium leading-none">
      First Name
    </label>
    <input
      id="firstName"
      type="text"
      placeholder="First Name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      disabled={disabled} // Apply the disabled prop
      className={`w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        disabled ? "bg-gray-200 cursor-not-allowed" : ""
      }`}
    />
  </div>
)

export default FirstNameInput
