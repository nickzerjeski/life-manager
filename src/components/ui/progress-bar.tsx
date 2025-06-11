type ProgbarProps = {
    name: string;
    progress: number;
};

export const Progbar = ({ name, progress }: ProgbarProps) => {
    return (
        <>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-white">{name}</span>
                <span className="text-sm font-medium text-blue-700 dark:text-white">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </>
    );
};