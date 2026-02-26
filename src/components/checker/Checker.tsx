import { Button, Checkbox } from '@orbita-ui/core';
import './Checker.css';
import React, { useEffect, useState } from "react";

export interface CheckerConf {
    callback: (checked: string[], checkedAfter: string[]) => void,
    listOptions: string[],
    currentChecks: Check[],
    optionsMark?: string[]
}

export class Check {
    public name: string;
    public cheked: boolean;

    constructor(name: string, check: boolean) {
        this.name = name;
        this.cheked = check;
    }
}

const Checker = (config: CheckerConf) => {

    const [checks, setChecks] = useState<Check[]>();
    const [ready, setReady] = useState(false);
    const [checkedAfter, setCheckedAfter] = useState<string[]>();

    useEffect(() => {
        let checkMap = [];
        let checkedEditOptions: string[] = []
        if (config.currentChecks != undefined) {
            config.currentChecks.forEach(e => {
                checkedEditOptions.push(e.name)
            });
            setCheckedAfter(checkedEditOptions)
        }
        config.listOptions.forEach((checkName) => {            
            checkMap.push(
                new Check(checkName,
                    checkedEditOptions != undefined && checkedEditOptions.length > 0 ? checkedEditOptions.includes(checkName) : (config.optionsMark != undefined && config.optionsMark.includes(checkName))
                )
            );
        })
        setChecks(checkMap);

        setReady(true);
    }, [])

    function changeStatus(key: string) {
        let checkMap = [];
        checks.forEach((check) => {
            if (check.name == key) {
                checkMap.push(new Check(check.name, !check.cheked));
            } else
                checkMap.push(new Check(check.name, check.cheked));
        });
        setChecks(checkMap);
    }

    return (
        <div className='container'>
            <div className='row'>
                {ready &&
                    checks.map((item, index) => {

                        return (<>
                            <div className="col-sm-6">
                                <div className="card">
                                    <div className="card-body">
                                        <Checkbox
                                            key={index}
                                            isChecked={item.cheked}
                                            label={item.name}
                                            onChange={(e) => {
                                                changeStatus(item.name)
                                            }}
                                            size="m"
                                            textAlign="right"
                                        />
                                    </div>
                                </div>
                            </div>
                        </>)
                    })}
            </div>
            <div className='row'>
                <div className="d-flex flex-row-reverse">
                    <div className="p-2">
                        <Button size="small" onClick={() => {
                            let checked: string[] = []
                            checks.forEach(c => {
                                if (c.cheked)
                                    checked.push(c.name)
                            });
                            config.callback(checked, checkedAfter)
                        }}>Guardar</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checker;