import { filterOptions } from "@/config"
import { Fragment } from "react"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"


const Filter = ({filters, handelFilter}) => {

  return (
    <div className="bg-background rounded-lg shadow-sm">
        <div className="p-4 border-b">
            <h2 className="text-lg font-extrabold">Filters</h2>
        </div>
        <div className="p-4 space-y-4">
            {
                Object.keys(filterOptions).map((keyIyems) => <Fragment>
                    <div>
                        <h3 className="text-base font-bold">{keyIyems}</h3>
                        <div className="grid gap-2 mt-2">
                            {
                                filterOptions[keyIyems].map((option) => <Label
                                className="flex items-center font-medium gap-2">
                                    <Checkbox 
                                        onChecked={
                                            filters && Object.keys(filters).length > 0 && filters[keyIyems] && filters[keyIyems].indexOf(option.id) > -1
                                        }
                                        onCheckedChange={() => handelFilter(keyIyems, option.id)}
                                    />
                                    {option.label}
                                </Label>)
                            }
                        </div>
                    </div>
                    <Separator />
                </Fragment>)
            }
        </div>
    </div>
  )
}

export default Filter
