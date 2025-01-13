import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitButtonProps {
  isPending: boolean
  label: string // Add a label prop
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isPending, label }) => (
  <Button
    type="submit"
    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
    disabled={isPending}
  >
    {isPending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {label}...
      </>
    ) : (
      label
    )}
  </Button>
)

export default SubmitButton
