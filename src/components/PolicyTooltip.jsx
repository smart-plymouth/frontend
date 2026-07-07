import { useState, useRef, useEffect } from 'react'

const POLICY_DATA = {
  'NPPF Paragraph 186, Item a': {
    summary: 'Requires plans to protect sites of biodiversity value, which includes SSSIs adjacent to the development.',
    text: 'Plans should: distinguish between the hierarchy of international, national and locally designated sites; allocate land with the least environmental or amenity value, where consistent with other policies in this Framework.'
  },
  'NPPF Paragraph 187': {
    summary: 'Identifies that habitats and biodiversity can be irreplaceable and must be given appropriate weight.',
    text: 'The presumption in favour of sustainable development does not apply where the plan or project is likely to have a significant effect on a habitats site (either alone or in combination with other plans or projects), unless an appropriate assessment has concluded that the plan or project will not adversely affect the integrity of the habitats site.'
  },
  'NPPF Paragraph 192, Items a–d': {
    summary: 'Sets out principles for conserving biodiversity including avoiding harm to habitats, maintaining ecological networks, and securing measurable net gain.',
    text: 'To protect and enhance biodiversity and geodiversity, plans should: a) Identify, map and safeguard components of local wildlife-rich habitats and wider ecological networks; b) promote the conservation, restoration and enhancement of priority habitats, ecological networks and the protection and recovery of priority species; and identify and pursue opportunities for securing measurable net gains for biodiversity; c) identify and protect areas that function as stepping stones for wildlife; d) promote the preservation, restoration and re-creation of priority habitats, ecological networks.'
  },
  'NPPF Paragraph 186, Item d': {
    summary: 'Requires development to deliver measurable biodiversity net gain as a condition of planning permission.',
    text: 'Plans should: promote the conservation, restoration and enhancement of priority habitats, ecological networks and the protection and recovery of priority species; and identify and pursue opportunities for securing measurable net gains for biodiversity.'
  },
  'NPPF Paragraph 189, Item a': {
    summary: 'Resists development that would cause significant harm to biodiversity unless adequately mitigated.',
    text: 'If significant harm to biodiversity resulting from a development cannot be avoided (through locating on an alternative site with less harmful impacts), adequately mitigated, or, as a last resort, compensated for, then planning permission should be refused.'
  },
  'NPPF Paragraph 190': {
    summary: 'Gives the strongest protection to SSSIs — development should not normally be permitted where it would harm them.',
    text: 'Development on land within or outside a Site of Special Scientific Interest, and which is likely to have an adverse effect on it (either individually or in combination with other developments), should not normally be permitted. The only exception is where the benefits of the development in the location proposed clearly outweigh both its likely impact on the features of the site that make it of special scientific interest, and any broader impacts on the national network of Sites of Special Scientific Interest.'
  },
  'NPPF Paragraph 192, Item c': {
    summary: 'Protects ecological stepping stones and corridors from construction-phase damage.',
    text: 'To protect and enhance biodiversity and geodiversity, plans should: identify and protect areas that function as stepping stones for wildlife, including those areas identified through national and local ecological designations.'
  },
  'NPPF Paragraph 192, Item d': {
    summary: 'Requires preservation of priority habitats from impacts including pollution, noise, and light.',
    text: 'To protect and enhance biodiversity and geodiversity, plans should: promote the preservation, restoration and re-creation of priority habitats, ecological networks, and the protection and recovery of priority species; and identify and pursue opportunities for securing measurable net gains for biodiversity.'
  },
  'NPPF Paragraph 193': {
    summary: 'Requires construction activities near protected sites to avoid direct or indirect harm.',
    text: 'When determining planning applications, local planning authorities should apply the following principles: if significant harm to biodiversity resulting from a development cannot be avoided, adequately mitigated, or, as a last resort, compensated for, then planning permission should be refused.'
  },
  'NPPF Paragraph 191': {
    summary: 'Requires planning decisions to ensure new development avoids unacceptable levels of air and noise pollution.',
    text: 'Planning policies and decisions should also ensure that new development is appropriate for its location taking into account the likely effects (including cumulative effects) of pollution on health, living conditions and the natural environment, as well as the potential sensitivity of the site or the wider area to impacts that could arise from the development.'
  },
  'NPPF Paragraph 205': {
    summary: 'Requires assessment of the significance of heritage assets including their setting.',
    text: 'In determining applications, local planning authorities should require an applicant to describe the significance of any heritage assets affected, including any contribution made by their setting. The level of detail should be proportionate to the assets\u2019 importance.'
  },
  'NPPF Paragraph 208': {
    summary: 'States that great weight should be given to conservation of designated heritage assets — the more important the asset, the greater the weight.',
    text: 'When considering the impact of a proposed development on the significance of a designated heritage asset, great weight should be given to the asset\'s conservation (and the more important the asset, the greater the weight should be). This is irrespective of whether any potential harm amounts to substantial harm, total loss or less than substantial harm to its significance.'
  },
  'NPPF Paragraph 212, Item a': {
    summary: 'Requires that any harm to Grade I listed heritage assets is weighed against substantial public benefits.',
    text: 'Where a development proposal will lead to less than substantial harm to the significance of a designated heritage asset, this harm should be weighed against the public benefits of the proposal including, where appropriate, securing its optimum viable use.'
  },
  'NPPF Paragraph 11, Item b': {
    summary: 'The presumption in favour of sustainable development requires strategic policies to provide for objectively assessed needs.',
    text: 'Plans and decisions should apply a presumption in favour of sustainable development. For plan-making this means that: strategic policies should, as a minimum, provide for objectively assessed needs for housing and other uses, as well as any needs that cannot be met within neighbouring areas.'
  },
  'NPPF Paragraph 11, Item d': {
    summary: 'Where policies are out of date, permission should still be refused if adverse impacts would significantly outweigh benefits.',
    text: 'Where there are no relevant development plan policies, or the policies which are most important for determining the application are out-of-date, granting permission unless: the application of policies in this Framework that protect areas or assets of particular importance provides a clear reason for refusing the development proposed; or any adverse impacts of doing so would significantly and demonstrably outweigh the benefits.'
  },
  'NPPF Paragraph 44': {
    summary: 'Requires that conditions attached to planning permissions are enforceable and necessary.',
    text: 'Planning conditions should be kept to a minimum and only imposed where they are necessary, relevant to planning and to the development to be permitted, enforceable, precise and reasonable in all other respects.'
  },
  'NPPF Paragraph 114, Items a–b': {
    summary: 'Requires that development only proceeds where the transport system can safely accommodate it.',
    text: 'In assessing sites that may be allocated for development in plans, or specific applications for development, it should be ensured that: a) appropriate opportunities to promote sustainable transport modes can be – or have been – taken up, given the type of development and its location; b) safe and suitable access to the site can be achieved for all users.'
  },
  'NPPF Paragraph 115': {
    summary: 'Development should only be prevented on highways grounds where there would be an unacceptable impact on safety or severe residual cumulative impact on the road network.',
    text: 'Development should only be prevented or refused on highways grounds if there would be an unacceptable impact on highway safety, or the residual cumulative impacts on the road network would be severe.'
  },
  'NPPF Paragraph 116': {
    summary: 'Applications for development should address the impacts on transport networks and demonstrate adequate provision.',
    text: 'All developments that will generate significant amounts of movement should be required to provide a travel plan, and the application should be supported by a transport statement or transport assessment so that the likely impacts of the proposal can be assessed.'
  },
  'NPPF Paragraph 116, Item b': {
    summary: 'Requires transport assessments to address the cumulative impacts of development.',
    text: 'All developments that will generate significant amounts of movement should be required to provide a travel plan, and the application should be supported by a transport statement or transport assessment so that the likely impacts of the proposal can be assessed.'
  },
  'NPPF Paragraph 131': {
    summary: 'Emphasises the importance of well-designed places and that developments should not be accepted if they fail to take opportunities for improving character and quality.',
    text: 'The creation of high quality, beautiful and sustainable buildings and places is fundamental to what the planning and development process should achieve. Good design is a key aspect of sustainable development, creates better places in which to live and work and helps make development acceptable to communities.'
  },
  'NPPF Paragraph 135, Items a, c': {
    summary: 'Requires developments to function well, be sympathetic to local character, and establish a strong sense of place.',
    text: 'Planning policies and decisions should ensure that developments: a) will function well and add to the overall quality of the area, not just for the short term but over the lifetime of the development; c) are sympathetic to local character and history, including the surrounding built environment and landscape setting, while not preventing or discouraging appropriate innovation or change.'
  },
  'NPPF Paragraph 135, Items b–c': {
    summary: 'Requires that developments are visually attractive, sympathetic to local character, and contribute to a sense of place.',
    text: 'Planning policies and decisions should ensure that developments: b) are visually attractive as a result of good architecture, layout and appropriate and effective landscaping; c) are sympathetic to local character and history, including the surrounding built environment and landscape setting, while not preventing or discouraging appropriate innovation or change.'
  },
  'NPPF Paragraph 135, Item f': {
    summary: 'Requires developments to create places that are safe, inclusive, and accessible with a clear sense of identity.',
    text: 'Planning policies and decisions should ensure that developments: f) create places that are safe, inclusive and accessible and which promote health and well-being, with a high standard of amenity for existing and future users; and where crime and disorder, and the fear of crime, do not undermine the quality of life or community cohesion and resilience.'
  },
  'NPPF Paragraph 139, Item a': {
    summary: 'Development that is not well designed should be refused — especially where it fails to reflect local design policies.',
    text: 'Development that is not well designed should be refused, especially where it fails to reflect local design policies and government guidance on design, taking into account any local design guidance and supplementary planning documents.'
  },
  'NPPF Paragraph 139, Item c': {
    summary: 'Conversely, significant weight should be given to outstanding or innovative designs that promote high levels of sustainability or raise the standard of design in the area.',
    text: 'Significant weight should be given to: development which reflects local design policies and government guidance on design, taking into account any local design guidance and supplementary planning documents such as design guides and codes; and/or outstanding or innovative designs which promote high levels of sustainability, or help raise the standard of design more generally in an area, so long as they fit in with the overall form and layout of their surroundings.'
  },
  'NPPF Paragraph 173': {
    summary: 'Requires development to be directed away from areas at highest risk of flooding.',
    text: 'Inappropriate development in areas at risk of flooding should be avoided by directing development away from areas at highest risk (whether existing or future). Where development is necessary in such areas, the development should be made safe for its lifetime without increasing flood risk elsewhere.'
  },
  'NPPF Paragraph 175': {
    summary: 'Applies the sequential test to steer development to areas with the lowest risk of flooding.',
    text: 'All plans should apply a sequential, risk-based approach to the location of development – taking into account all sources of flood risk and the current and future impacts of climate change – so as to avoid, where possible, flood risk to people and property.'
  },
  'NPPF Paragraph 180, Item a': {
    summary: 'Requires that development incorporates sustainable drainage systems unless there is clear evidence this is not appropriate.',
    text: 'Major developments should incorporate sustainable drainage systems unless there is clear evidence that this would be inappropriate. The systems used should: a) take account of advice from the lead local flood authority.'
  },
  'NPPF Paragraph 96': {
    summary: 'Recognises the importance of access to high quality open spaces and recreation opportunities for health and well-being.',
    text: 'Access to a network of high quality open spaces and opportunities for sport and physical activity is important for the health and well-being of communities, and can deliver wider benefits for nature and support efforts to address climate change.'
  },
  'NPPF Paragraph 103, Item b': {
    summary: 'Protects existing open space from development unless it is surplus to requirements or would be replaced.',
    text: 'Existing open space, sports and recreational buildings and land, including playing fields, should not be built on unless: b) the loss resulting from the proposed development would be replaced by equivalent or better provision in terms of quantity and quality in a suitable location.'
  },
  'NPPF Paragraph 186': {
    summary: 'Overarching requirement that plans promote conservation and enhancement of the natural environment.',
    text: 'Plans should: distinguish between the hierarchy of international, national and locally designated sites; allocate land with the least environmental or amenity value; take a strategic approach to maintaining and enhancing networks of habitats and green infrastructure; and plan for the enhancement of natural capital at a catchment or landscape scale across local authority boundaries.'
  },
  'JLP Policy SPT12': {
    summary: 'Strategic policy requiring development to protect and enhance biodiversity and geological conservation interests across the plan area.',
    text: 'Development will conserve and enhance the biodiversity and geological conservation interests of the Plan Area, by protecting the hierarchy of designated sites and species. Development should: retain natural features; protect and enhance the network of ecological corridors and stepping stones; and deliver a net gain in biodiversity.'
  },
  'JLP Policy DEV26': {
    summary: 'Development must avoid harm to biodiversity and deliver measurable net gain; the most sensitive sites (SSSIs) receive the highest protection.',
    text: 'Development should support the protection, conservation, enhancement and restoration of biodiversity and geodiversity across the Plan Area. Adverse impacts on European and nationally protected sites, species and habitats must be avoided. Development proposals that would be likely to directly or indirectly harm a SSSI will not be permitted unless the benefits of development clearly outweigh the impacts on the features of the site and the broader network.'
  },
  'JLP Policy DEV26, Item 3': {
    summary: 'Development near designated sites must avoid indirect impacts including disturbance from lighting, noise and vibration.',
    text: 'Adverse impacts from development on European and nationally protected species and habitats must be avoided. Proposals should minimise impacts on biodiversity and provide measurable net gains through habitat creation and enhancement, using a biodiversity offsetting metric. Indirect effects such as lighting, noise, and vibration on adjacent designated sites must be assessed and mitigated.'
  },
  'JLP Policy DEV26, Item 5': {
    summary: 'Requires all major developments to demonstrate measurable biodiversity net gain.',
    text: 'All development should deliver a net gain in biodiversity where possible, using a recognised biodiversity metric to demonstrate the net gain achieved. Major developments will be expected to deliver a minimum 10% biodiversity net gain.'
  },
  'JLP Policy SPT11': {
    summary: 'Strategic policy protecting the historic environment and requiring development to respect the significance and setting of heritage assets.',
    text: 'Development should sustain the historic environment, heritage assets and their settings, recognising their contribution to the quality of life of current and future generations. Designated heritage assets and their settings, and areas of historical and archaeological importance, will be conserved and enhanced.'
  },
  'JLP Policy DEV21': {
    summary: 'Requires development to conserve or enhance heritage assets and their settings, with great weight given to their conservation.',
    text: 'Development proposals will be assessed for their effect on the significance and setting of heritage assets. Great weight will be given to the conservation of designated heritage assets. Any harm to the significance of a designated or non-designated heritage asset must be justified, including through establishing that the harm is necessary to achieve public benefits that outweigh that harm.'
  },
  'JLP Policy SPT9': {
    summary: 'Strategic transport policy requiring development to be accessible by sustainable transport and mitigate impacts on the highway network.',
    text: 'Development will be required to contribute towards an integrated, safe, accessible and efficient transport network, maximising sustainable transport modes and minimising the need to travel by private car. Development proposals must mitigate their transport impacts in accordance with IDP requirements and consider cumulative effects.'
  },
  'JLP Policy DEV31': {
    summary: 'Requires development to demonstrate it can provide safe and adequate access without causing severe residual cumulative impact on the road network.',
    text: 'All development must be served by an adequate road network which can safely accommodate the traffic generated by the development. Development should not result in a severe residual cumulative impact on the road network. Where necessary, appropriate mitigation measures and contributions must be provided.'
  },
  'JLP Policy DEV32': {
    summary: 'Requires development to meet parking standards appropriate to the area and ensure adequate provision for residents and visitors.',
    text: 'Adequate parking provision should be made for the needs of all users and accessible to all, including disabled people. The quantity of parking required for developments will be in line with the adopted parking standards, or any successor standards.'
  },
  'JLP Policy DEV1': {
    summary: 'Overarching policy requiring all development to protect residential amenity and avoid unacceptable impacts on living conditions.',
    text: 'Development should be designed to ensure an acceptable standard of amenity for all users and occupants of the development, as well as to protect the amenity of occupiers of surrounding properties. Development should not lead to unacceptable levels of noise, nuisance, visual intrusion, overlooking or loss of privacy, overshadowing, loss of daylight, or overbearing effects.'
  },
  'JLP Policy SPT1': {
    summary: 'Overarching spatial strategy delivering sustainable linked neighbourhoods; development must align with the strategic growth pattern.',
    text: 'Development will be delivered in accordance with the spatial strategy which focuses growth on the cities and main towns, supported by sustainable linked neighbourhoods. Development outside these areas will be strictly managed.'
  },
  'JLP Policy SPT2': {
    summary: 'Requires development to deliver sustainable linked communities with infrastructure to meet needs including transport, health, education, and community facilities.',
    text: 'Sustainable linked neighbourhoods in Plymouth will deliver development that provides homes, jobs, community facilities and a range of other uses and services to create self-sustaining neighbourhoods, well connected to the rest of the city and the wider sub-region by sustainable transport modes.'
  },
  'JLP Policy SPT3, Item 3': {
    summary: 'Sets density standards requiring a balance between efficient land use and appropriate character.',
    text: 'Housing development should achieve densities which make effective and efficient use of land while providing an appropriate range and mix of housing types and sizes and reflecting the character and accessibility of the area.'
  },
  'JLP Policy DEV20': {
    summary: 'Comprehensive design quality policy requiring development to respect local character, create good places, and function well.',
    text: 'Development should deliver places that are well connected, accessible and legible. They should be designed to be safe and inclusive, function well, be adaptable and resilient, and contribute positively to the area in terms of layout, density, design, materials, landscape and streetscape.'
  },
  'JLP Policy DEV20, Items 1–4': {
    summary: 'Requires development to respond to local character, topography, building patterns, and materials in its design.',
    text: 'Development proposals will be expected to meet a range of design criteria: 1) Respond positively to the character and distinctiveness of the area; 2) Respect the scale, form, massing, density and proportions of surrounding buildings; 3) Create clearly defined, well-enclosed, attractive and functional public and private spaces; 4) Use materials and detailing appropriate to the local vernacular.'
  },
  'JLP Policy DEV20, Item 5': {
    summary: 'Requires development to protect the amenity of neighbouring properties including privacy and outlook.',
    text: 'Development proposals will be expected to: protect the amenity of the occupiers of surrounding properties, including from overlooking, loss of privacy, loss of outlook, and overbearing impact.'
  },
  'JLP Policy DEV20, Item 8': {
    summary: 'Requires development to design out crime and provide natural surveillance.',
    text: 'Development proposals will be expected to: design out crime and disorder and create safe environments through appropriate layout, access, lighting, and natural surveillance of public and private spaces.'
  },
  'JLP Policy DEV23': {
    summary: 'Requires development on the edge of settlements to respect the transition from urban to rural character.',
    text: 'Development at the urban fringe should demonstrate sensitivity to the edge of settlement location and respect the transition in character from urban to rural. It should integrate successfully with the existing settlement pattern and not result in a harsh urban/rural interface.'
  },
  'JLP Policy DEV35': {
    summary: 'Requires development to manage flood risk through sustainable drainage and not increase risk elsewhere.',
    text: 'Development should not increase flood risk to the site or the surrounding area. Development should apply the sequential approach and, where necessary, the exception test. Sustainable drainage systems should be incorporated into all major developments to manage surface water run-off, improve water quality, and provide amenity and biodiversity benefits.'
  },
  'JLP Policy DEV37': {
    summary: 'Requires development to manage surface water and foul water drainage sustainably and avoid pollution of watercourses.',
    text: 'Development must make provision for sustainable management of surface water and foul water to prevent pollution of the water environment, avoid increasing flood risk, and protect ecological interests in receiving watercourses.'
  },
  'JLP Policy DEV2': {
    summary: 'Requires development to avoid harmful impacts on air quality, water quality, and noise and light pollution.',
    text: 'Development proposals should not cause unacceptable harm to the amenity of existing or future users of the site, or adjoining occupiers, through pollution, contamination, noise, vibration, light, odour, or other emissions. Development must not individually or cumulatively have an unacceptable impact on air quality.'
  },
  'JLP Policy DEV2, Item 4': {
    summary: 'Specifically requires that development does not have an unacceptable impact on air quality individually or cumulatively.',
    text: 'Development must not individually or cumulatively have an unacceptable impact on air quality. Measures must be put in place to mitigate any significant adverse air quality impacts, including from increased traffic generation.'
  },
  'JLP Policy DEV10': {
    summary: 'Requires development to design out crime through layout, lighting, and natural surveillance.',
    text: 'Proposals should demonstrate that they have been designed to minimise crime and disorder and create a safe, inclusive environment. Development should provide natural surveillance, well-defined routes and spaces, appropriate lighting, and defensible space.'
  },
  'JLP Policy DEV3': {
    summary: 'Protects existing public open space and requires new development to provide accessible recreational opportunities.',
    text: 'The loss of existing open space, sports or recreational facilities will not normally be permitted unless it can be demonstrated that the open space is surplus to requirements, or any loss would be replaced by equivalent or better provision in a suitable location.'
  },
  'JLP Policy DEV27': {
    summary: 'Requires development to maintain and enhance green infrastructure networks and corridors.',
    text: 'Development proposals should protect, enhance, and restore the green infrastructure network and demonstrate how they integrate with and contribute to the wider network. Proposals which sever green infrastructure links or which would harm their function will not be permitted unless alternative provision of equivalent or better value is made.'
  },
  'Town and Country Planning (Environmental Impact Assessment) Regulations 2017, Schedule 2': {
    summary: 'Schedule 2 requires EIA screening for developments near sensitive areas including SSSIs — a full EIA should be triggered given the proximity and scale.',
    text: 'Schedule 2 development requires Environmental Impact Assessment screening where the development is likely to have significant effects on the environment by virtue of factors such as its nature, size, or location. Urban development projects exceeding 150 dwellings, or where the overall area of development exceeds 5 hectares, or is in a sensitive area, fall within Schedule 2.'
  },
}


function PolicyBadge({ label }) {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState('bottom')
  const badgeRef = useRef(null)
  const timeoutRef = useRef(null)

  const data = POLICY_DATA[label]

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setPosition(spaceBelow < 280 ? 'top' : 'bottom')
    }
    setShow(true)
  }

  function handleLeave() {
    timeoutRef.current = setTimeout(() => setShow(false), 150)
  }

  if (!data) {
    return (
      <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 rounded">
        {label}
      </span>
    )
  }

  return (
    <span
      ref={badgeRef}
      className="relative inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      tabIndex={0}
    >
      <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 rounded cursor-help hover:bg-indigo-100 transition-colors border border-indigo-200/50">
        {label}
      </span>
      {show && (
        <span
          className={`absolute z-50 left-0 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-left ${
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <span className="block text-xs font-bold text-indigo-800 mb-1.5">{label}</span>
          <span className="block text-xs font-semibold text-slate-700 mb-2">{data.summary}</span>
          <span className="block text-[11px] text-slate-500 italic leading-relaxed border-t border-slate-100 pt-2">
            "{data.text}"
          </span>
        </span>
      )}
    </span>
  )
}

export default function PolicyReferences({ policies }) {
  const items = policies.split('; ')
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {items.map((item, i) => (
        <PolicyBadge key={i} label={item} />
      ))}
    </div>
  )
}
