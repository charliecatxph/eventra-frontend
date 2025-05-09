import TextInput from "../Inputs/TextInput";
import TextAreaInput from "../Inputs/TextAreaInput";

export default function Information({data, onDataChange}) {
    return (
        <>
            <section className="eventra-container-narrow pt-5">
                <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
                    <div className="flex gap-2 items-start">
                        <TextInput
                            identifier="ev-n"
                            title="Name"
                            value={data.name.value}
                            placeholder="My First Event on Eventra"
                            onInput={(dx) => {
                                onDataChange({
                                    ...data,
                                    name: {
                                        value: dx,
                                        err: "",
                                    },
                                });
                            }}
                            error={data.name.err}
                            className="w-1/2"
                            req
                        />
                        <TextInput
                            identifier="ev-loc"
                            title="Location"
                            value={data.location.value}
                            placeholder="Silicon Valley"
                            onInput={(dx) => {
                                onDataChange({
                                    ...data,
                                    location: {
                                        value: dx,
                                        err: "",
                                    },
                                });
                            }}
                            error={data.location.err}
                            className="w-1/2"
                            req
                        />
                    </div>
                    <TextInput
                        identifier="ev-orgby"
                        title="Organized By"
                        value={data.organizedBy.value}
                        placeholder="CTX Technologies"
                        onInput={(dx) => {
                            onDataChange({
                                ...data,
                                organizedBy: {
                                    value: dx,
                                    err: "",
                                },
                            });
                        }}
                        error={data.organizedBy.err}
                        className=""
                        req
                    />
                    <TextAreaInput
                        identifier="ev-desc"
                        title="Description"
                        value={data.description.value}
                        placeholder="CTX Technologies"
                        onInput={(dx) => {
                            onDataChange({
                                ...data,
                                description: {
                                    value: dx,
                                    err: "",
                                },
                            });
                        }}
                        error={data.description.err}
                    />
                </div>
            </section>
        </>
    );
}
